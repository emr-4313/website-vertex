/* supq.lol — static site + a real download counter.
 *
 * Everything except the two paths in `run_worker_first` is served straight
 * off Cloudflare's edge and never reaches this script. Only the installer
 * and the count endpoint pay for a Worker invocation.
 */
import { DurableObject } from "cloudflare:workers";

const SETUP_PATH = "/supQ-Setup.exe";

/* One person re-clicking Download shouldn't move the number. Same IP + UA
   inside this window counts once. */
const DEDUPE_WINDOW_MS = 12 * 60 * 60 * 1000;

/* Link unfurlers and crawlers hit the .exe as soon as it's posted anywhere.
   None of those are people. */
const NOT_A_PERSON =
  /bot\b|crawl|spider|slurp|headless|preview|scan|monitor|facebookexternalhit|discord|telegram|whatsapp|twitterbot|slackbot|embedly|bitlybot|quicklook/i;

/* ── the counter ─────────────────────────────────────────────────────── */
/* A single instance on purpose: the number is global, so the writes have to
   land in one place. Volume is a few downloads a minute, nowhere near the
   point where one object is a bottleneck. */
export class DownloadCounter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS totals (
          name  TEXT PRIMARY KEY,
          count INTEGER NOT NULL DEFAULT 0
        )`);
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS seen (
          fingerprint TEXT PRIMARY KEY,
          ts          INTEGER NOT NULL
        )`);
      this.ctx.storage.sql.exec(
        `CREATE INDEX IF NOT EXISTS seen_ts ON seen (ts)`);
    });
  }

  /* No awaits in here on purpose — the object is single-threaded, so the
     dedupe check and the increment can't interleave with another request. */
  record(fingerprint) {
    const now = Date.now();
    this.ctx.storage.sql.exec(
      `DELETE FROM seen WHERE ts < ?`, now - DEDUPE_WINDOW_MS);

    const already = this.ctx.storage.sql
      .exec(`SELECT 1 FROM seen WHERE fingerprint = ?`, fingerprint)
      .toArray().length > 0;
    if (already) return this.total();

    this.ctx.storage.sql.exec(
      `INSERT INTO seen (fingerprint, ts) VALUES (?, ?)`, fingerprint, now);
    this.ctx.storage.sql.exec(`
      INSERT INTO totals (name, count) VALUES ('setup', 1)
      ON CONFLICT (name) DO UPDATE SET count = count + 1`);

    return this.total();
  }

  total() {
    const row = this.ctx.storage.sql
      .exec(`SELECT count FROM totals WHERE name = 'setup'`).toArray()[0];
    return row ? Number(row.count) : 0;
  }
}

/* ── helpers ─────────────────────────────────────────────────────────── */

/* Hashed so we never store anyone's address. Truncated to 128 bits, which is
   still far past collision range for this many rows. */
async function fingerprint(request) {
  const raw = [
    request.headers.get("cf-connecting-ip") || "",
    request.headers.get("user-agent") || "",
  ].join("|");
  const digest = await crypto.subtle.digest(
    "SHA-256", new TextEncoder().encode(raw));
  return [...new Uint8Array(digest, 0, 16)]
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

function isRealDownload(request) {
  if (request.method !== "GET") return false;

  const ua = request.headers.get("user-agent") || "";
  if (!ua || NOT_A_PERSON.test(ua)) return false;

  /* Resumed or chunked transfers are the same download continuing. Only the
     request that starts at byte 0 counts. */
  const range = request.headers.get("range");
  if (range && !/^bytes=0-/i.test(range)) return false;

  return true;
}

/* ── worker ──────────────────────────────────────────────────────────── */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/downloads") {
      const count = await env.DOWNLOADS.getByName("setup").total();
      return Response.json(
        { count },
        {
          headers: {
            "cache-control": "public, max-age=60",
            "access-control-allow-origin": "https://supq.lol",
          },
        },
      );
    }

    if (url.pathname === SETUP_PATH) {
      if (isRealDownload(request)) {
        /* Counted alongside the response, not before it — nobody waits on
           the database to start their download. */
        ctx.waitUntil(
          fingerprint(request)
            .then((fp) => env.DOWNLOADS.getByName("setup").record(fp))
            .catch(() => {}),
        );
      }

      const asset = await env.ASSETS.fetch(request);
      const response = new Response(asset.body, asset);
      response.headers.set(
        "content-disposition", 'attachment; filename="supQ-Setup.exe"');
      return response;
    }

    return env.ASSETS.fetch(request);
  },
};
