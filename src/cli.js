#!/usr/bin/env node
'use strict';

/**
 * enlyai-bulk-apikey CLI — mint EnlyAI accounts, one key per account, verify
 * every key with a live chat call and write the survivors to keys.txt.
 *
 * The whole flow is plain REST, no e-mail, no captcha, no browser:
 *   POST /api/user/register {username,password[,email]}   → 200 (no verification)
 *   POST /api/user/login                                  → session cookie + user id
 *   POST /api/token/ {name}                               → key (`sk-…` style)
 *   POST /v1/chat/completions  Bearer <key>               → live check (200 = kept)
 *
 * Your proxy list is OPTIONAL (default `proxies.txt`, or $ENLYAI_PROXIES):
 * every request goes through a line from it when one is provided — a dead exit
 * fails that attempt and the tool moves to the next — and without a list the
 * tool connects directly.
 *
 * Options:
 *   --count N          how many accounts/keys to mint (default 50)
 *   --verify-only      re-check every key in keys.txt with a live chat call
 *   --screen           only test the proxy list against the host
 *   --model <id>       model used for the live verification (default the first
 *                      id of the catalogue that answers)
 *   --help
 *   --preset=turbo|balanced|safe   run shape = workers + inter-account gap
 *                      (turbo = 5 workers / 3 s — recommended; balanced = 4/6;
 *                      safe = 2/8). Explicit --conc/--gap override the preset.
 *
 * Environment: ENLYAI_PROXIES (proxy list path, default proxies.txt)
 * Zero dependencies. Node.js >= 18.
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const https = require('https');
const { URL } = require('url');
const { presetArgv, resolvePreset } = require('./preset');
const { AsyncLocalStorage } = require('async_hooks');
const { uaFor } = require('./ua-pool');

const ROOT = path.resolve(__dirname, '..');
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.json');
const OUT_DIR = path.join(ROOT, 'outputs');

const BASE = 'https://api.enlyai.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
// Per-account fingerprint (operator standard v3): the pool runs several accounts
// at once, so each account carries its own UA from the ua-pool per async context.
const SESS = new AsyncLocalStorage();
const activeUa = (dflt) => { const s = SESS.getStore(); return (s && s.ua) || dflt; };

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);

if (has('help') || has('h')) {
  console.log('enlyai-bulk-apikey — mint EnlyAI accounts, one key each, verified by a live chat call.\n');
  console.log('  node src/cli.js --count 50     mint (keys kept only after a 200)');
  console.log('  node src/cli.js --verify-only  re-check keys.txt');
  console.log('  node src/cli.js --screen       test the proxy list against EnlyAI');
  console.log('  node src/cli.js --preset=turbo --count 50 run shape (turbo = 5 workers)');
  console.log('\nEnv: ENLYAI_PROXIES (proxy list path, default proxies.txt — optional: without a pool the tool connects directly)');
  process.exit(0);
}
/** `--n=5`, or the `--n 5` form `arg()` already reads. */
const flagVal = (n) => {
  const eq = argv.find((a) => a.startsWith(`--${n}=`));
  if (eq) return eq.split('=').slice(1).join('=');
  return arg(n, null);
};
const numOrNull = (v) => {
  const n = v === null || v === undefined || v === true ? NaN : parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};
/** A bare flag, junk or nothing keeps the default; a real value wins. */
const numArg = (n, dflt) => {
  const v = numOrNull(flagVal(n));
  return v === null ? dflt : v;
};
const MODEL = flagVal('model') || '';
const VERIFY_ONLY = has('verify-only');
const SCREEN_ONLY = has('screen');
const PROXY_FILE = process.env.ENLYAI_PROXIES || flagVal('proxies') || 'proxies.txt';
const COUNT = numArg('count', 50);
// A run that asks for nothing is a usage error, not a success line.
if (COUNT < 1 && !SCREEN_ONLY && !VERIFY_ONLY) {
  console.error(`[fatal] --count must be at least 1 (got ${COUNT})`);
  process.exit(1);
}

// Presets (operator standard v3): --preset picks workers + inter-account gap,
// explicit --conc/--gap win over it, and without --preset the rail keeps
// today's shape exactly (one account at a time, 800 ms pad).
const PRESET_RUN = resolvePreset({
  preset: presetArgv() || arg('preset', null),
  conc: numOrNull(flagVal('conc')),
  gap: numOrNull(flagVal('gap')),
  defaultConc: 1,
  defaultGap: 0.8,
});

// ---------------------------------------------------------------- proxy (CONNECT over http/https)

/** The pool file, or `[null]` when there is no pool at all (the documented
 *  direct mode). A file that is there and has candidate lines but no line
 *  `parseProxy()` accepts is an error: turning that into "no proxy" would put
 *  the whole run on this machine's own address, which the contract forbids. */
function loadProxies() {
  const f = path.resolve(ROOT, PROXY_FILE);
  if (!fs.existsSync(f)) {
    // No pool = DIRECT mode: a proxy is recommended at scale (per-IP limits,
    // bans) but the tool works without one. `null` is the direct sentinel.
    console.log(`no proxy list at ${PROXY_FILE} — running WITHOUT a proxy (direct). Put exits there (or set ENLYAI_PROXIES) to route through them.`);
    return [null];
  }
  const lines = fs
    .readFileSync(f, 'utf8')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('#') && !s.startsWith('//'));
  if (!lines.length) {
    console.log(`proxy list ${PROXY_FILE} has no usable exits — running WITHOUT a proxy (direct).`);
    return [null];
  }
  const usable = lines.filter((s) => proxyLib.parseProxy(s));
  if (!usable.length) {
    throw new Error(`proxy list ${PROXY_FILE} has ${lines.length} candidate line(s) but no usable exit — a line must be host:port, host:port:user:pass, user:pass@host:port, scheme://[user:pass@]host:port or host|port|user|pass. Fix the file, or remove it to run direct.`);
  }
  if (usable.length !== lines.length) console.log(`proxy list ${PROXY_FILE}: ${lines.length - usable.length} unusable line(s) skipped`);
  return usable;
}

const proxyLib = require('./proxy.js');

/** Minimal HTTP client — https through the shared proxy agent (river/src/proxy.js),
 *  the layer the other rails (token8341, radox) already trust. The old hand-rolled
 *  CONNECT path silently drained the event loop on Node ≥24 and killed the run. */
function request(proxyLine, url, { method = 'GET', headers = {}, body = null, timeoutMs = 30000 } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = body === null ? null : Buffer.from(JSON.stringify(body));
    const hs = { 'user-agent': activeUa(UA), ...headers };
    if (payload) {
      hs['Content-Type'] = hs['Content-Type'] || 'application/json';
      hs['Content-Length'] = payload.length;
    }
    const px = proxyLine ? proxyLib.parseProxy(proxyLine) : null;
    // Fail closed: a line that does not parse must never become "no proxy".
    if (proxyLine && !px) return reject(new Error(`unusable proxy line "${proxyLine}" — refusing to fall back to a direct connection`));
    const r = https.request(
      { method, host: u.hostname, port: u.port || 443, path: u.pathname + u.search, headers: hs, agent: px ? proxyLib.createAgent(px) : undefined },
      (res) => {
        let t = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (t += c));
        res.on('end', () => resolve({ status: res.statusCode || 0, text: t, setCookie: res.headers['set-cookie'] || [] }));
      }
    );
    r.setTimeout(timeoutMs, () => r.destroy(new Error('timeout')));
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

const jparse = (s) => { try { return JSON.parse(s); } catch { return null; } };
// Account credentials are secrets: Math.random is the one PRNG you must not
// use for them. Same shape as before (`enlyai` + 6 chars / `En` + 8 chars + `!7`).
const rand36 = (n) => Array.from({ length: n }, () => crypto.randomInt(36).toString(36)).join('');
const randName = () => 'enlyai' + rand36(6);
const randPass = () => 'En' + rand36(8) + '!7';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 0o600 is POSIX-only — Windows ignores it — but keys.txt is the file that
// ends up in a 9Router, so it gets the mode where the mode means something.
function appendKey(key) {
  fs.mkdirSync(ROOT, { recursive: true });
  fs.appendFileSync(KEYS_FILE, `${key}\n`, { mode: 0o600 });
  try {
    fs.appendFileSync(path.join(process.env.USERPROFILE || process.env.HOME || ROOT, 'enlyai-keys.txt'), `${key}\n`, { mode: 0o600 });
  } catch (e) { /* home mirror is best-effort */ }
}

/** The ledger is the only copy of each account's password and key: write it
 *  beside itself and rename, so a kill cannot truncate it. */
function saveAccounts(accounts) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(`${ACCOUNTS_FILE}.tmp`, JSON.stringify(accounts, null, 2), { mode: 0o600 });
  fs.renameSync(`${ACCOUNTS_FILE}.tmp`, ACCOUNTS_FILE);
}

/** `accounts.json` that exists but does not parse is an error, never "no
 *  accounts yet": the next write would drop every record it holds. */
function loadAccounts() {
  if (!fs.existsSync(ACCOUNTS_FILE)) return [];
  const parsed = jparse(fs.readFileSync(ACCOUNTS_FILE, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error(`${path.basename(ACCOUNTS_FILE)} is not valid JSON — move it aside if you want a fresh file; every account's password and key lives here`);
  return parsed;
}

// ---------------------------------------------------------------- flows
async function screen(proxies) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  for (const px of proxies) {
    const tag = px || 'direct';
    try {
      const r = await request(px, `${BASE}/api/status`, { timeoutMs: 12000 });
      const good = r.status === 200 && /system_name|success/.test(r.text);
      console.log(`${good ? '✔' : '✖'} ${tag} -> ${r.status}`);
      if (good) ok++;
      if (good && px) fs.appendFileSync(path.join(OUT_DIR, 'proxies-live.txt'), `${px}\n`);
    } catch (e) {
      console.log(`✖ ${tag} -> ${String((e && e.message) || e).slice(0, 60)}`);
    }
  }
  console.log(`live ${ok}/${proxies.length}`);
}

async function pickVerificationModel(proxy, key) {
  if (MODEL) return MODEL;
  const r = await request(proxy, `${BASE}/v1/models`, { headers: { authorization: `Bearer ${key}` }, timeoutMs: 20000 });
  const j = jparse(r.text);
  const ids = j && j.data ? j.data.map((m) => m.id) : [];
  if (!ids.length) throw new Error(`catalogue empty: ${r.status} ${r.text.slice(0, 120)}`);
  return ids[0];
}

async function mintOne(proxy, index, accounts) {
  const username = randName();
  const password = randPass();
  const email = `${username}@enlyai-bulk.example`;
  const reg = await request(proxy, `${BASE}/api/user/register`, { method: 'POST', body: { username, password, email } });
  if (!/"success"\s*:\s*true/.test(reg.text)) throw new Error(`register ${reg.status}: ${reg.text.slice(0, 120)}`);
  const login = await request(proxy, `${BASE}/api/user/login`, { method: 'POST', body: { username, password } });
  const cookie = login.setCookie.map((c) => c.split(';')[0]).join('; ');
  const lj = jparse(login.text);
  if (!lj || !lj.success || !cookie) throw new Error(`login ${login.status}: ${login.text.slice(0, 120)}`);
  const uid = lj.data && lj.data.id;
  const tokenRes = await request(proxy, `${BASE}/api/token/`, {
    method: 'POST',
    headers: { cookie, ...(uid ? { 'new-api-user': String(uid) } : {}) },
    body: { name: `enlyai-${index}`, remain_quota: 0, expired_time: -1, unlimited_quota: true },
  });
  const tj = jparse(tokenRes.text);
  let key = (tj && tj.data && (tj.data.key || (tj.data.token && tj.data.token.key))) || null;
  if (!key) {
    // The create endpoint only answers {"success":true} on this deployment —
    // list the newest token and reveal its key (same shape as token8341).
    const auth = { cookie, ...(uid ? { 'new-api-user': String(uid) } : {}) };
    const list = await request(proxy, `${BASE}/api/token/?p=0&size=20`, { headers: auth });
    const items = ((jparse(list.text) || {}).data || {}).items || [];
    if (items.length) {
      const rev = await request(proxy, `${BASE}/api/token/${items[0].id}/key`, { method: 'POST', headers: auth });
      console.log(`   reveal ${rev.status}: ${rev.text.replace(/\s+/g, ' ').slice(0, 120)}`);
      const rj = jparse(rev.text) || {};
      key = (rj.data && (rj.data.key || rj.key)) || (typeof rj === 'string' ? rj : null);
    }
  }
  if (!key) throw new Error(`token ${tokenRes.status}: ${tokenRes.text.slice(0, 120)}`);
  console.log(`   key=${String(key).slice(0, 10)}… len=${String(key).length}`);
  // The key is returned once: record the account (password included) before the
  // gate, so a dead exit during verification cannot lose the account and key.
  const rec = { index, username, password, uid, key, model: null, chat: null, at: new Date().toISOString() };
  accounts.push(rec);
  saveAccounts(accounts);
  let ok = false;
  try {
    rec.model = await pickVerificationModel(proxy, key);
    const chat = await request(proxy, `${BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}` },
      body: { model: rec.model, messages: [{ role: 'user', content: 'Reply OK' }], max_tokens: 8 },
      timeoutMs: 60000,
    });
    ok = chat.status === 200 && /"content"\s*:/.test(chat.text);
    rec.chat = { status: chat.status, ok };
  } catch (e) {
    rec.chat = { status: 0, ok: false, error: String((e && e.message) || e).slice(0, 140) };
  }
  saveAccounts(accounts);
  console.log(`${ok ? '✔' : '✖'} #${index} ${username} key ${key.slice(0, 10)}… chat ${rec.chat.status}`);
  if (ok) {
    appendKey(key);
    console.log('   written to keys.txt');
  }
  return { ok, key };
}

async function mint() {
  const proxies = loadProxies();
  const accounts = loadAccounts();
  const conc = Math.max(1, PRESET_RUN.conc);
  const gapMs = Math.max(0, PRESET_RUN.gap) * 1000;
  console.log(`ENLYAI-MINT start · count=${COUNT} conc=${conc} gap=${gapMs / 1000}s${PRESET_RUN.name ? ` preset=${PRESET_RUN.name}` : ''}`);
  let made = 0, attempts = 0, next = 1;
  async function worker() {
    while (made < COUNT && attempts < COUNT * 6) {
      const i = next++;
      attempts++;
      const proxy = proxies[attempts % proxies.length];
      console.log(`… #${i} başladı (${proxy ? String(proxy).replace(/:[^:@]+@/, ':***@') : 'direct'})`);
      try {
        const r = await SESS.run({ ua: uaFor(i).ua }, () => mintOne(proxy, accounts.length + 1, accounts));
        if (r.ok) {
          made++;
          console.log(`✓ #${i} KEY ALINDI: ${String(r.key).slice(0, 22)}… [${made} ok / ${attempts} deneme]`);
        } else {
          console.log(`✗ #${i} key yok: chat gate failed`);
        }
      } catch (e) {
        console.log(`✗ #${i} key yok: ${String((e && e.message) || e).slice(0, 140)}`);
      }
      if (gapMs) await sleep(gapMs);
    }
  }
  await Promise.all(Array.from({ length: Math.min(conc, Math.max(1, COUNT)) }, () => worker()));
  console.log(`done: ${made} key(s) this run, ${accounts.length} account(s) total`);
  console.log(`ENLYAI-MINT ${made}/${COUNT} ${made >= COUNT ? 'OK' : '— short of the target'}`);
  if (made < COUNT) process.exitCode = 1;
}

async function verifyOnly() {
  const proxies = loadProxies();
  const keys = fs.existsSync(KEYS_FILE) ? fs.readFileSync(KEYS_FILE, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [];
  let ok = 0;
  for (const [i, key] of keys.entries()) {
    const proxy = proxies[i % proxies.length];
    try {
      const model = await pickVerificationModel(proxy, key);
      const chat = await request(proxy, `${BASE}/v1/chat/completions`, {
        method: 'POST',
        headers: { authorization: `Bearer ${key}` },
        body: { model, messages: [{ role: 'user', content: 'Reply OK' }], max_tokens: 8 },
        timeoutMs: 60000,
      });
      const good = chat.status === 200 && /"content"\s*:/.test(chat.text);
      console.log(`${good ? '✔' : '✖'} ${key.slice(0, 10)}… (${model}) -> ${chat.status}`);
      if (good) ok++;
    } catch (e) {
      console.log(`✖ ${key.slice(0, 10)}… -> ${String((e && e.message) || e).slice(0, 80)}`);
    }
    await sleep(600);
  }
  console.log(`verified ${ok}/${keys.length}`);
  if (keys.length && !ok) process.exitCode = 1; // nothing confirmed is not a success
}

(async () => {
  if (SCREEN_ONLY) return screen(loadProxies());
  if (VERIFY_ONLY) return verifyOnly();
  return mint();
})().catch((e) => {
  console.error('[fatal]', String((e && e.message) || e).slice(0, 300));
  process.exit(1);
});
