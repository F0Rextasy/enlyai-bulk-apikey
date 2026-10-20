<div align="center">

```
███████╗███╗   ██╗██╗  ██╗   ██╗ █████╗ ██╗
██╔════╝████╗  ██║██║  ╚██╗ ██╔╝██╔══██╗██║
█████╗  ██╔██╗ ██║██║   ╚████╔╝ ███████║██║
██╔══╝  ██║╚██╗██║██║    ╚██╔╝  ██╔══██║██║
███████╗██║ ╚████║███████╗██║   ██║  ██║██║
╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝   ╚═╝  ╚═╝╚═╝
```

# enlyai-bulk-apikey

**Bulk-create EnlyAI accounts with auto-generated API keys — OpenAI-compatible inference + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-8-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

EnlyAI hands out a **500,000,000,000-unit welcome quota per account** and mints the first API key over plain REST — **no e-mail, no captcha, no card, no browser**. That makes one account per key the natural unit, and this tool turns that into a `keys.txt` where every line survived a live chat call.

## 🎁 Free tier — how much you get

**Every new account gets a 500,000,000,000-unit welcome quota** — no e-mail, no captcha, no card, no browser.

| What | Value |
| --- | --- |
| Welcome quota | **500,000,000,000 units** (`quota` on `GET /api/user/self` right after sign-up) |
| Card required | **No** |
| Sign-up | plain REST — username + password (the e-mail field is free-form; no code is ever sent) |
| The unit that scales | **one account = one key** → `--count N` is really "N free accounts" |

> 💡 The free tier is set by EnlyAI and can change. Check the live numbers at [api.enlyai.com](https://api.enlyai.com) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 8 of them

`GET /v1/models` (with a key) serves 8 ids; the live-verified ones:

|Model|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|
|`enlyai-work`|✓|
|`google/diffusiongemma-26b-a4b-it`|✓|
|`meta/llama-3.2-11b-vision-instruct`|✓|
|`meta/muse-glimmer-30b`|✓|
|`nvidia/nemotron-3-super-120b-a12b`|✓|
|`nvidia/nemotron-3.5-lightning-30b-a3b`|✓|

**How much is free:** the welcome quota measured on a fresh account: `GET /api/user/self` answers `quota: 500000000000` right after sign-up (units are the panel's own quota scale). The grant is per account, so `--count N` multiplies it. `minimaxai/minimax-m3` was retired upstream (410 Gone) — the tool never lists it.

## 🧪 How to use the API

The base URL is **`https://api.enlyai.com/v1`** — OpenAI-compatible, so anything that speaks OpenAI works.

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Set the base URL in any agent or SDK (Cursor, OpenCode, Kilo Code, …) and pick any model id above.

## 🛠 Quick start

```bash
# clone or fork this repository, then:
cd enlyai-bulk-apikey

# 1) your proxy list, one per line (http://… or socks5://…) — optional
printf 'http://127.0.0.1:8080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go
node src/launcher.js        # interactive
# or directly:
node src/cli.js --count 50
```

`keys.txt` (mirrored to `%USERPROFILE%\enlyai-keys.txt`) is written **only** after a live chat completion proves the key.

### 🖱️ The launcher

The launcher asks for the proxy list (optional — without one the CLI runs direct), count and verification model, remembers them in `launcher.config.json`, and runs the CLI with the right flags.

## ✅ Verified working — every key is tested

| Check | Result |
| --- | --- |
| `POST /api/user/register` | **200** — no e-mail, phone, card or captcha at any step |
| welcome quota | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200** with the key in the response |
| `POST /v1/chat/completions` — run for **every** key before it is written | **200** with real content (e.g. nemotron answers with `reasoning_content`) |
| a key that fails its chat check | never written to `keys.txt` — the account stays recoverable in `accounts.json` |

Re-check at any time:

```bash
node src/cli.js --verify-only
```

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: EnlyAI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.enlyai.com/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| status | `GET /api/status` | reachability + gates (recorded: `em:false, ts:false`) |
| signup | `POST /api/user/register {username,password,email}` | e-mail is a plain string field — no code is ever sent |
| sign-in | `POST /api/user/login` | session cookie; keep it for the token calls |
| key | `POST /api/token/ {name}` | key returned in the response body |
| check | `POST /v1/chat/completions` | live 200 required before `keys.txt` |

## ⚙️ CLI options

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| Environment variable | Default | Meaning |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | pool file, one proxy per line — optional: without a pool the CLI connects directly |

## 🛰️ Behind a proxy

**Optional — recommended at scale (per-IP limits, bans).** The tool works without a proxy too.

- **With a pool:** put one exit per line in `proxies.txt` (or set `ENLYAI_PROXIES`) — every request goes through a line from it, a dead line fails that attempt and the tool moves on.
- **Without a pool:** the CLI prints `running WITHOUT a proxy (direct)` and connects directly; sign-up, key minting and the chat gate are unchanged — only where the packets leave from.
- `--screen` works in either mode: it tests the exits you have (or the direct route) against the host before a run.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.json` | username / password / uid / key / chat status per account |
| `proxies.txt` | your exits, one per line — git-ignored |
| `outputs/` | run state — git-ignored |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. Register this provider once and every key becomes a connection under one provider-node:

```bash
node src/connect-9router.js
```

Defaults: `--base http://localhost:20128`, `--password 123456`, `--name "EnlyAI"`, `--prefix enlyai`, `--base-url https://api.enlyai.com/v1`. Models are then served as `enlyai/<model id>` and load-balanced across every key.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 What the provider gives | one account per key — email-free, every key chat-verified |
| 🔑 What one key gets you | one API key scoped to its own account: the 8 model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 Your data | only api.enlyai.com and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

If EnlyAI changes its signup shape or quota, the tool stops at that step and says so. **[Open an issue](../../issues)** with the command you ran and the exact output; PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey contributors

</div>

## ⚡ Run shape (presets)

`--preset=turbo|balanced|safe` sets workers + the pause between accounts (turbo = 5,
balanced = 4, safe = 2); explicit `--conc`/`--gap` (or the repo's own flags) always win,
and without `--preset` the tool keeps its historical shape exactly.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.
