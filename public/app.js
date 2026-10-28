(function () {
  'use strict';

  var reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ── screenshots ──────────────────────────────────────────────────── */

  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
    var frame = document.getElementById('frame');
    if (!tabs.length || tabs.length !== shots.length) return;

    var INTERVAL = 5000;
    var current = 0;
    var timer = null;
    var hovering = false;

    function show(i, focus) {
      current = (i + shots.length) % shots.length;
      shots.forEach(function (s, n) { s.classList.toggle('is-visible', n === current); });
      tabs.forEach(function (t, n) {
        t.setAttribute('aria-selected', n === current ? 'true' : 'false');
        t.tabIndex = n === current ? 0 : -1;
      });
      if (focus) tabs[current].focus();

      // On narrow screens the tab row scrolls; keep the active tab in view without
      // moving the page itself.
      var row = tabs[current].parentNode;
      if (row.scrollWidth > row.clientWidth) {
        var t = tabs[current];
        row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
      schedule();
    }

    function schedule() {
      if (timer) clearTimeout(timer);
      timer = null;
      if (!hovering) timer = setTimeout(function () { show(current + 1); }, INTERVAL);
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1, true); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); show(current - 1, true); }
      });
    });

    if (frame) {
      frame.addEventListener('mouseenter', function () { hovering = true; schedule(); });
      frame.addEventListener('mouseleave', function () { hovering = false; schedule(); });
    }

    show(0);
  }

  /* ── wave canvas ──────────────────────────────────────────────────── */

  function initWaveCanvas() {
    var canvas = document.getElementById('waveCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var isLowEnd = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    var width = 0, height = 0, dpr = 1;
    var isVisible = true;

    var particles = [];
    for (var p = 0; p < (isLowEnd ? 12 : 22); p++) {
      particles.push({
        x: Math.random() * (window.innerWidth || 1000),
        y: Math.random() * (window.innerHeight || 800),
        size: Math.random() * 1.2 + 0.5,
        speedY: Math.random() * 0.3 + 0.1,
        speedX: (Math.random() - 0.5) * 0.14
      });
    }

    var waves = [
      { baseYRatio: 0.66, amplitude: 52, frequency: 0.0017, speed: 0.0011, phase: 0.0,
        fill: 'rgba(76, 29, 149, 0.22)', line: 'rgba(147, 51, 234, 0.38)', lineWidth: 1.2 },
      { baseYRatio: 0.74, amplitude: 62, frequency: 0.0023, speed: 0.0015, phase: 2.1,
        fill: 'rgba(126, 34, 206, 0.17)', line: 'rgba(168, 85, 247, 0.46)', lineWidth: 1.5 },
      { baseYRatio: 0.84, amplitude: 44, frequency: 0.0031, speed: -0.0018, phase: 4.2,
        fill: 'rgba(168, 85, 247, 0.12)', line: 'rgba(197, 139, 251, 0.50)', lineWidth: 1.2 }
    ];
    if (isLowEnd) waves = waves.slice(0, 2);

    function resize() {
      dpr = isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      waves.forEach(function (w) {
        var baseY = height * w.baseYRatio;
        var grad = ctx.createLinearGradient(0, Math.max(0, baseY - w.amplitude), 0, height);
        grad.addColorStop(0, w.fill);
        grad.addColorStop(1, 'rgba(10, 8, 14, 0)');
        w.grad = grad;
      });
      if (reducedMotion) draw(0, false);
    }

    function draw(elapsed, moveParticles) {
      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      for (var i = 0; i < particles.length; i++) {
        var pt = particles[i];
        if (moveParticles) {
          pt.y -= pt.speedY;
          pt.x += pt.speedX;
          if (pt.y < -10) { pt.y = height + 10; pt.x = Math.random() * width; }
          if (pt.x < -10) pt.x = width + 10;
          if (pt.x > width + 10) pt.x = -10;
        }
        ctx.moveTo(pt.x + pt.size, pt.y);
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      }
      ctx.fillStyle = 'rgba(197, 139, 251, 0.35)';
      ctx.fill();

      var step = isLowEnd ? 18 : 12;
      waves.forEach(function (w) {
        var baseY = height * w.baseYRatio;
        var time = elapsed * w.speed + w.phase;
        ctx.beginPath();
        for (var x = 0; x <= width + step; x += step) {
          var y = baseY
                + Math.sin(x * w.frequency + time) * w.amplitude
                + Math.sin(x * w.frequency * 0.45 + time * 0.65) * (w.amplitude * 0.3);
          if (x === 0) ctx.moveTo(0, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w.line;
        ctx.lineWidth = w.lineWidth;
        ctx.stroke();
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = w.grad;
        ctx.fill();
      });
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });

    resize();
    if (reducedMotion) return;

    var start = performance.now();
    var last = 0;
    function frame(now) {
      if (!isVisible) return;
      if (now - last >= 15) {
        last = now;
        draw(now - start, true);
      }
      requestAnimationFrame(frame);
    }

    document.addEventListener('visibilitychange', function () {
      isVisible = !document.hidden;
      if (isVisible) requestAnimationFrame(frame);
    });

    requestAnimationFrame(frame);
  }

  function boot() {
    initTabs();
    initWaveCanvas();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
