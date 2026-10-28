(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toggleDetails = (details) => {
    const body = $(".side-fns", details);
    if (!body || reduceMotion || !body.animate) {
      details.open = !details.open;
      return;
    }
    body.getAnimations().forEach((a) => a.cancel());
    const opening = !details.open;
    if (opening) details.open = true;
    const full = body.scrollHeight;
    const frames = opening
      ? [{ height: "0px", opacity: 0 }, { height: full + "px", opacity: 1 }]
      : [{ height: full + "px", opacity: 1 }, { height: "0px", opacity: 0 }];
    details.classList.toggle("closing", !opening);
    const animation = body.animate(frames, { duration: 220, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" });
    animation.onfinish = () => {
      if (!opening) details.open = false;
      details.classList.remove("closing");
      animation.cancel();
    };
  };

  for (const summary of $$(".side-lib > summary")) {
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      const details = summary.parentElement;
      const href = summary.dataset.href;
      if (event.target.closest(".side-chevron") || location.pathname === href) {
        toggleDetails(details);
      } else {
        location.href = href;
      }
    });
  }

  const sidebarEl = $("#sidebar");
  const activeLib = $(".side-lib > summary.active");
  if (sidebarEl && activeLib) sidebarEl.scrollTop = Math.max(0, activeLib.offsetTop - sidebarEl.clientHeight / 4);

  const closeNav = () => document.body.classList.remove("nav-open");
  $("#menuBtn")?.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  $("#scrim")?.addEventListener("click", closeNav);
  for (const link of $$(".sidebar a")) link.addEventListener("click", closeNav);

  for (const button of $$("[data-copy]")) {
    button.addEventListener("click", async () => {
      const holder = button.closest(".sig, .codeblock");
      const code = holder && $("code", holder);
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.innerText.trimEnd());
        button.classList.remove("done");
        void button.offsetWidth;
        button.classList.add("done");
        setTimeout(() => button.classList.remove("done"), 1400);
      } catch {  }
    });
  }

  const sections = $$(".fn, .main h2[id]");
  const tocLinks = new Map($$(".toc-link").map((a) => [a.getAttribute("href").slice(1), a]));
  const sideLinks = new Map($$(".side-lib[open] .side-fn").map((a) => [a.hash.slice(1), a]));

  if (sections.length) {
    let pending = false;
    const markCurrent = () => {
      pending = false;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 120) current = section;
        else break;
      }
      for (const [id, a] of tocLinks) a.classList.toggle("current", id === current.id);
      for (const [id, a] of sideLinks) a.classList.toggle("current", id === current.id);
    };
    const schedule = () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(markCurrent);
      }
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("hashchange", schedule);
    document.fonts?.ready.then(markCurrent);
    markCurrent();
  }

  const flashTarget = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (!target || !target.classList.contains("fn")) return;
    target.classList.remove("flash");
    void target.offsetWidth;
    target.classList.add("flash");
  };
  addEventListener("hashchange", flashTarget);
  flashTarget();

  const dialog = $("#search");
  const input = $("#searchInput");
  const results = $("#searchResults");
  let index = null;
  let items = [];
  let selected = 0;

  const loadIndex = async () => {
    if (index) return index;
    try {
      const response = await fetch("/search-index.json");
      index = await response.json();
    } catch {
      index = [];
    }
    return index;
  };

  const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const mark = (text, query) => {
    const i = text.toLowerCase().indexOf(query);
    if (i < 0) return escapeHtml(text);
    return escapeHtml(text.slice(0, i)) + "<mark>" + escapeHtml(text.slice(i, i + query.length)) + "</mark>" + escapeHtml(text.slice(i + query.length));
  };

  const score = (entry, q) => {
    const name = entry.n.toLowerCase();
    const bare = name.replace(/^[a-z]+[.:]/, "");
    if (name === q || bare === q) return 0;
    if (name.startsWith(q) || bare.startsWith(q)) return 1 + name.length / 100;
    if (name.includes(q)) return 2 + name.indexOf(q) / 100;
    const alias = (entry.a || []).find((a) => a.toLowerCase().includes(q));
    if (alias) return { s: alias.toLowerCase() === q ? 1.5 : 3, alias };
    if (entry.d.toLowerCase().includes(q)) return 5;
    return null;
  };

  const render = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      items = (index || []).filter((e) => e.k === "library");
    } else {
      items = (index || [])
        .map((e) => {
          const s = score(e, q);
          if (s === null) return null;
          return typeof s === "object" ? { e, s: s.s, alias: s.alias } : { e, s };
        })
        .filter(Boolean)
        .sort((a, b) => a.s - b.s || (a.e.k === "library" ? -1 : 1) || a.e.n.localeCompare(b.e.n))
        .slice(0, 40)
        .map((r) => ({ ...r.e, alias: r.alias }));
    }
    selected = 0;
    if (!items.length) {
      results.innerHTML = `<div class="search-empty">No results for “${escapeHtml(input.value)}”</div>`;
      return;
    }
    results.innerHTML = items.map((e, i) => `
      <a class="result${i === 0 ? " selected" : ""}" href="${e.u}" role="option" data-i="${i}">
        <div class="result-top">
          <span class="result-name">${mark(e.n, q)}</span>
          ${e.alias ? `<span class="result-alias">alias ${escapeHtml(e.alias)}</span>` : ""}
          <span class="result-kind">${e.k === "library" ? "Library" : escapeHtml(e.g)}</span>
        </div>
        <div class="result-desc">${escapeHtml(e.d)}</div>
      </a>`).join("");
  };

  const select = (i) => {
    const nodes = $$(".result", results);
    if (!nodes.length) return;
    selected = (i + nodes.length) % nodes.length;
    nodes.forEach((n, k) => n.classList.toggle("selected", k === selected));
    nodes[selected].scrollIntoView({ block: "nearest" });
  };

  let closeTimer = 0;
  const openSearch = async () => {
    clearTimeout(closeTimer);
    dialog.hidden = false;
    requestAnimationFrame(() => dialog.classList.add("open"));
    input.value = "";
    input.focus();
    await loadIndex();
    render();
  };
  const closeSearch = () => {
    dialog.classList.remove("open");
    closeTimer = setTimeout(() => { dialog.hidden = true; }, reduceMotion ? 0 : 160);
  };

  $("#searchBtn")?.addEventListener("click", openSearch);
  dialog?.addEventListener("click", (e) => { if (e.target === dialog) closeSearch(); });
  input?.addEventListener("input", render);
  results?.addEventListener("click", (e) => { if (e.target.closest(".result")) closeSearch(); });
  input?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); select(selected + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); select(selected - 1); }
    else if (e.key === "Enter") {
      const target = items[selected];
      if (target) { closeSearch(); location.href = target.u; }
    }
  });

  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || "");
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      dialog.hidden ? openSearch() : closeSearch();
    } else if (e.key === "/" && !typing && dialog.hidden) {
      e.preventDefault();
      openSearch();
    } else if (e.key === "Escape") {
      if (!dialog.hidden) closeSearch();
      closeNav();
    }
  });

  const startWaves = () => {
    const canvas = $("#waveCanvas");
    const ctx = canvas && canvas.getContext("2d");
    if (!ctx) return;

    const lowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    let width = 0;
    let height = 0;

    const waves = [
      { base: 0.66, amp: 52, freq: 0.0017, speed: 0.0011, phase: 0, from: "rgba(76, 29, 149, 0.22)", line: "rgba(147, 51, 234, 0.38)", lw: 1.2 },
      { base: 0.74, amp: 62, freq: 0.0023, speed: 0.0015, phase: 2.1, from: "rgba(126, 34, 206, 0.17)", line: "rgba(168, 85, 247, 0.46)", lw: 1.5 },
      { base: 0.84, amp: 44, freq: 0.0031, speed: -0.0018, phase: 4.2, from: "rgba(168, 85, 247, 0.12)", line: "rgba(197, 139, 251, 0.50)", lw: 1.2 },
    ].slice(0, lowEnd ? 2 : 3);

    const particles = Array.from({ length: lowEnd ? 10 : 20 }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      size: Math.random() * 1.5 + 0.6,
      vy: Math.random() * 0.3 + 0.1,
      vx: (Math.random() - 0.5) * 0.16,
    }));

    const resize = () => {
      const dpr = lowEnd ? 1 : Math.min(devicePixelRatio || 1, 1.5);
      width = innerWidth;
      height = innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const w of waves) {
        const g = ctx.createLinearGradient(0, Math.max(0, height * w.base - w.amp), 0, height);
        g.addColorStop(0, w.from);
        g.addColorStop(1, "rgba(6, 4, 8, 0)");
        w.grad = g;
      }
    };

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    addEventListener("mousemove", (e) => { mouse.tx = e.clientX; mouse.ty = e.clientY; mouse.active = true; }, { passive: true });
    document.addEventListener("mouseleave", () => { mouse.active = false; });

    let resizeTimer = 0;
    addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
    resize();

    const drawWaves = (elapsed) => {
      const step = lowEnd ? 18 : 12;
      for (const w of waves) {
        const baseY = height * w.base;
        const t = elapsed * w.speed + w.phase;
        ctx.beginPath();
        for (let x = 0; x <= width + step; x += step) {
          let y = Math.sin(x * w.freq + t) * w.amp + Math.sin(x * w.freq * 0.45 + t * 0.65) * w.amp * 0.3;
          if (mouse.active) {
            const dist = Math.abs(x - mouse.x);
            if (dist < 220) y += (mouse.y - baseY) * 0.12 * Math.cos((dist / 220) * 1.5708);
          }
          if (x === 0) ctx.moveTo(0, baseY + y);
          else ctx.lineTo(x, baseY + y);
        }
        ctx.strokeStyle = w.line;
        ctx.lineWidth = w.lw;
        ctx.stroke();
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = w.grad;
        ctx.fill();
      }
    };

    if (reduceMotion) {
      drawWaves(0);
      return;
    }

    const start = performance.now();
    let last = 0;
    let running = false;
    const frame = (now) => {
      if (document.hidden) {
        running = false;
        return;
      }
      requestAnimationFrame(frame);
      if (now - last < 15) return;
      last = now;
      if (mouse.active) {
        mouse.x += (mouse.tx - mouse.x) * 0.08;
        mouse.y += (mouse.ty - mouse.y) * 0.08;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      for (const p of particles) {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fillStyle = "rgba(197, 139, 251, 0.38)";
      ctx.fill();
      drawWaves(now - start);
    };
    const run = () => {
      if (running) return;
      running = true;
      requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", () => { if (!document.hidden) run(); });
    run();
  };
  startWaves();
})();
