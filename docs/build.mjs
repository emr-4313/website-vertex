import { mkdirSync, rmSync, writeFileSync, copyFileSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { groups } from "./content/index.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "public");
const VERSION = Date.now().toString(36);

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const prose = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");

const LUA_KEYWORDS = new Set(("and break do else elseif end false for function if in local nil not or repeat " +
  "return then true until while continue export type").split(" "));
const LUA_GLOBALS = new Set(("print warn error pcall xpcall type typeof tostring tonumber pairs ipairs next select " +
  "require game workspace script task math string table coroutine Instance Vector2 Vector3 Color3 Enum").split(" "));

function highlightLua(src) {
  const re = /(--\[(=*)\[[\s\S]*?\]\2\]|--[^\n]*)|(\[(=*)\[[\s\S]*?\]\4\]|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b0x[0-9a-fA-F_]+\b|\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g;
  let html = "";
  let last = 0;
  for (const m of src.matchAll(re)) {
    html += esc(src.slice(last, m.index));
    last = m.index + m[0].length;
    if (m[1]) html += `<span class="t-com">${esc(m[0])}</span>`;
    else if (m[3]) html += `<span class="t-str">${esc(m[0])}</span>`;
    else if (m[5]) html += `<span class="t-num">${esc(m[0])}</span>`;
    else if (LUA_KEYWORDS.has(m[0])) html += `<span class="t-kw">${m[0]}</span>`;
    else if (LUA_GLOBALS.has(m[0])) html += `<span class="t-glob">${m[0]}</span>`;
    else if (src[last] === "(") html += `<span class="t-fn">${m[0]}</span>`;
    else html += m[0];
  }
  return html + esc(src.slice(last));
}

function highlightSig(sig) {
  const open = sig.indexOf("(");
  const head = open > 0 ? sig.slice(0, open) : sig;
  const rest = open > 0 ? sig.slice(open) : "";
  const body = esc(rest)
    .replace(/([A-Za-z_][\w]*)(\??): /g, '<span class="s-param">$1$2</span>: ')
    .replace(/(-&gt;)/g, '<span class="s-arrow">$1</span>')
    .replace(/\b(string|number|boolean|function|table|thread|any|nil|buffer|userdata)\b/g, '<span class="s-type">$1</span>')
    .replace(/\b([A-Z][A-Za-z0-9]+)\b/g, '<span class="s-class">$1</span>');
  return `<span class="s-name">${esc(head)}</span>${body}`;
}

const ICONS = {
  book: '<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',
  braces: '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
  bug: '<rect x="8" y="6" width="8" height="14" rx="4"/><path d="M19 7l-3 2M5 7l3 2M19 19l-3-2M5 19l3-2M20 13h-4M4 13h4M10 4l1 2M14 4l-1 2"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/>',
  table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  "file-code": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2"/>',
  binary: '<rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4M14 10h4M6 14h2v6M14 4h2v6"/>',
  boxes: '<path d="M7 16.5 3 14v-4l4-2.5 4 2.5v4zM7 16.5V12M17 16.5 13 14v-4l4-2.5 4 2.5v4zM17 16.5V12M12 9 8 6.5v-4L12 0l4 2.5v4z"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
  radio: '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19.1 4.9a10 10 0 0 1 0 14.2M4.9 19.1a10 10 0 0 1 0-14.2"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>',
  mouse: '<rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/>',
  terminal: '<path d="m4 17 6-6-6-6M12 19h8"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  "file-binary": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M10 12h2v6M10 18h4"/>',
  network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/>',
  sparkles: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>',
  pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  "git-branch": '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v6M18 9a9 9 0 0 1-9 9"/>',
  brush: '<path d="M9.1 11.1 18 2.2a1.6 1.6 0 0 1 2.3 2.3l-8.9 8.9M7 14a3 3 0 0 0-3 3c0 1.3-1 2-2 2 1 1.5 3 2 4 2a4 4 0 0 0 4-4 3 3 0 0 0-3-3z"/>',
  type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
  "app-window": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4M2 8h20M6 4v4"/>',
  regex: '<path d="M17 3v10M12.7 5.5l8.6 5M12.7 10.5l8.6-5"/><rect x="3" y="15" width="6" height="6" rx="1"/>',
  "list-tree": '<path d="M21 12h-8M21 6H8M21 18h-8M3 6v4c0 1.1.9 2 2 2h3M3 10v6c0 1.1.9 2 2 2h3"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  list: '<path d="M3 6h18M3 12h12M3 18h15"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.8 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
};

const icon = (name, size = 16) =>
  `<svg class="icon" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.book}</svg>`;

const DISCORD = '<svg viewBox="0 0 127.14 96.36" width="20" height="16" fill="currentColor" aria-hidden="true"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>';

const allLibs = groups.flatMap((g) => g.libs.map(([s, lib]) => ({ slug: s, lib, group: g })));

function sidebar(active) {
  const intro = `<a class="side-link${active === "" ? " active" : ""}" href="/">${icon("book")}<span>Introduction</span></a>`;
  const sections = groups.map((g) => {
    const items = g.libs.map(([s, lib]) => {
      const open = s === active;
      const fns = lib.fns.map((f) =>
        `<a class="side-fn" href="/${s}/#${slug(f.name)}">${esc(f.name)}</a>`).join("");
      return `<details class="side-lib"${open ? " open" : ""}>
        <summary class="side-link${open ? " active" : ""}" data-href="/${s}/">
          ${icon(lib.icon)}<span>${esc(lib.title)}</span>
          <span class="side-chevron">${icon("chevron", 14)}</span>
        </summary>
        <div class="side-fns">${fns}</div>
      </details>`;
    }).join("");
    return `<div class="side-group${g.compat ? " compat" : ""}">
      <div class="side-heading">${esc(g.title)}</div>
      ${g.note ? `<p class="side-note">${esc(g.note)}</p>` : ""}
      ${items}
    </div>`;
  }).join("");
  return `<nav class="sidebar" id="sidebar" aria-label="Libraries">${intro}${sections}</nav>`;
}

function page({ title, description, active, main, toc }) {
  const tocHtml = toc && toc.length
    ? `<aside class="toc" aria-label="On this page">
        <div class="toc-title">${icon("list", 14)}<span>On this page</span></div>
        ${toc.map((t) => `<a class="toc-link" href="#${t.id}">${esc(t.label)}</a>`).join("")}
      </aside>`
    : `<aside class="toc"></aside>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#060408">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <link rel="icon" href="/logo-64.png" sizes="64x64">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css?v=${VERSION}">
</head>
<body>
  <canvas id="waveCanvas" class="wave-canvas" aria-hidden="true"></canvas>
  <header class="topbar">
    <div class="topbar-inner">
      <button class="icon-btn menu-btn" id="menuBtn" aria-label="Open navigation">${icon("menu", 20)}</button>
      <a class="brand" href="/"><img src="/logo-64.png" alt="" width="26" height="26"><span>supQ</span><span class="brand-tag">Docs</span></a>
      <button class="search-trigger" id="searchBtn" aria-label="Search the docs">
        ${icon("search")}<span>Search</span><kbd>Ctrl</kbd><kbd>K</kbd>
      </button>
      <div class="topbar-links">
        <a class="top-link" href="https://supq.lol">supq.lol</a>
        <a class="icon-btn" href="https://discord.gg/SeC9jXhxGb" target="_blank" rel="noopener" aria-label="Discord">${DISCORD}</a>
      </div>
    </div>
  </header>
  <div class="layout">
    ${sidebar(active)}
    <main class="main" id="main">${main}</main>
    ${tocHtml}
  </div>
  <div class="scrim" id="scrim"></div>
  <div class="search" id="search" role="dialog" aria-modal="true" aria-label="Search" hidden>
    <div class="search-box">
      <div class="search-input-row">${icon("search", 18)}<input id="searchInput" type="search" placeholder="Search functions, aliases, libraries…" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></div>
      <div class="search-results" id="searchResults" role="listbox"></div>
    </div>
  </div>
  <script src="/app.js?v=${VERSION}" defer></script>
</body>
</html>
`;
}

function fnCard(f, libSlug) {
  const id = slug(f.name);
  const aliases = f.aliases && f.aliases.length
    ? `<div class="aliases"><span class="label">Aliases</span>${f.aliases.map((a) => `<code>${esc(a)}</code>`).join("")}</div>` : "";
  const origin = f.origin ? `<span class="origin">${esc(f.origin)}</span>` : "";
  const rows = (list, head) => list && list.length
    ? `<table class="ptable"><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${
        list.map((r) => `<tr>${r.map((c, i) => `<td>${i === head.length - 1 ? prose(c) : `<code>${esc(c)}</code>`}</td>`).join("")}</tr>`).join("")
      }</tbody></table>` : "";
  const params = f.params && f.params.length ? `<h4>Parameters</h4>${rows(f.params, ["Name", "Type", "Description"])}` : "";
  const returns = f.returns && f.returns.length ? `<h4>Returns</h4>${rows(f.returns, ["Type", "Description"])}` : "";
  const typeTable = f.table ? rows(f.table, ["Type", "Properties"]) : "";
  const example = f.example
    ? `<div class="codeblock"><div class="codeblock-head"><span>Example</span><button class="copy" data-copy aria-label="Copy example">${icon("copy", 14)}</button></div><pre><code>${highlightLua(f.example)}</code></pre></div>` : "";
  return `<section class="fn" id="${id}">
    <h3 class="fn-name"><a href="#${id}" class="anchor" aria-label="Link to ${esc(f.name)}">${icon("link", 14)}</a>${esc(f.name)}${origin}</h3>
    <div class="sig"><code>${highlightSig(f.sig)}</code><button class="copy" data-copy aria-label="Copy signature">${icon("copy", 14)}</button></div>
    <p>${prose(f.desc)}</p>
    ${typeTable}${aliases}${params}${returns}${example}
  </section>`;
}

function libPage({ slug: s, lib, group }) {
  const badges = lib.origin ? `<div class="origins">${lib.origin.map((o) => `<span class="origin">${esc(o)}</span>`).join("")}</div>` : "";
  const compatNote = group.compat
    ? `<div class="callout">${icon("sparkles")}<span>This API comes from ${lib.origin ? esc(lib.origin.join(" / ")) : "another executor"}. supQ implements it so scripts written for it run unchanged.</span></div>` : "";
  const main = `
    <div class="crumbs"><a href="/">Docs</a><span>/</span><span>${esc(group.title)}</span></div>
    <h1>${icon(lib.icon, 26)}${esc(lib.title)}</h1>
    ${badges}
    <p class="lead">${prose(lib.blurb)}</p>
    ${lib.intro ? `<p>${prose(lib.intro)}</p>` : ""}
    ${compatNote}
    <div class="fn-list">${lib.fns.map((f) => fnCard(f, s)).join("")}</div>
    ${pager(s)}`;
  return page({
    title: `${lib.title} · supQ Docs`,
    description: lib.blurb.replace(/`/g, ""),
    active: s,
    main,
    toc: lib.fns.map((f) => ({ id: slug(f.name), label: f.name })),
  });
}

function pager(s) {
  const i = allLibs.findIndex((l) => l.slug === s);
  const prev = allLibs[i - 1];
  const next = allLibs[i + 1];
  const link = (l, dir) => l
    ? `<a class="pager-link ${dir}" href="/${l.slug}/"><span class="pager-dir">${dir === "prev" ? "Previous" : "Next"}</span><span>${esc(l.lib.title)}</span></a>`
    : "<span></span>";
  return `<nav class="pager">${link(prev, "prev")}${link(next, "next")}</nav>`;
}

function homePage() {
  const total = allLibs.reduce((n, l) => n + l.lib.fns.length, 0);
  const cards = (g) => g.libs.map(([s, lib]) => `
    <a class="card" href="/${s}/">
      <div class="card-head">${icon(lib.icon)}<span>${esc(lib.title)}</span>${lib.origin ? `<span class="origin small">${esc(lib.origin[0])}${lib.origin.length > 1 ? " +" + (lib.origin.length - 1) : ""}</span>` : ""}</div>
      <p>${prose(lib.blurb)}</p>
    </a>`).join("");
  const sections = groups.map((g) => `
    <h2 id="${slug(g.title)}">${esc(g.title)}</h2>
    ${g.note ? `<p class="muted">${esc(g.note)}</p>` : ""}
    <div class="cards">${cards(g)}</div>`).join("");
  const main = `
    <h1 class="home-title">Introduction</h1>
    <p class="lead">The reference for supQ's scripting environment: every library and function you can call from an executed script.</p>
    <p>supQ follows the sUNC naming conventions, so most scripts written for other executors work as-is. Functions are listed under their main name, with their other names under <em>Aliases</em>. APIs that only exist because another executor introduced them are kept apart in <a href="#compatibility">Compatibility</a>.</p>
    <div class="callout">${icon("search")}<span>Press <kbd>Ctrl</kbd> <kbd>K</kbd> to search ${total} functions by name or alias.</span></div>
    ${sections}`;
  return page({
    title: "supQ Docs",
    description: "Reference for supQ's Luau scripting environment: closures, debug, reflection, signals, drawing, RakNet and more.",
    active: "",
    main,
    toc: groups.map((g) => ({ id: slug(g.title), label: g.title })),
  });
}

function notFoundPage() {
  return page({
    title: "Not found · supQ Docs",
    description: "Page not found.",
    active: null,
    main: `<h1>Page not found</h1><p class="lead">That page doesn't exist. Try the search (<kbd>Ctrl</kbd> <kbd>K</kbd>) or go back to the <a href="/">introduction</a>.</p>`,
    toc: [],
  });
}

function searchIndex() {
  const entries = [];
  for (const { slug: s, lib, group } of allLibs) {
    entries.push({ n: lib.title, k: "library", u: `/${s}/`, g: group.title, d: lib.blurb.replace(/`/g, "") });
    for (const f of lib.fns) {
      entries.push({
        n: f.name, k: "function", u: `/${s}/#${slug(f.name)}`, g: lib.title,
        a: f.aliases || [], d: f.desc.replace(/`/g, "").slice(0, 140),
      });
    }
  }
  return entries;
}

mkdirSync(out, { recursive: true });
for (const entry of readdirSync(out)) rmSync(join(out, entry), { recursive: true, force: true });

const write = (path, content) => {
  const file = join(out, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};

write("index.html", homePage());
write("404.html", notFoundPage());
for (const l of allLibs) write(`${l.slug}/index.html`, libPage(l));
write("search-index.json", JSON.stringify(searchIndex()));
write("styles.css", readFileSync(join(root, "static", "styles.css")));
write("app.js", readFileSync(join(root, "static", "app.js")));
write("_headers", readFileSync(join(root, "static", "_headers")));

const logo = join(root, "..", "public", "logo-64.png");
if (existsSync(logo)) copyFileSync(logo, join(out, "logo-64.png"));

const fnCount = allLibs.reduce((n, l) => n + l.lib.fns.length, 0);
console.log(`docs: ${allLibs.length} libraries, ${fnCount} entries → ${out}`);
