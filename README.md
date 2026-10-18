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

[🛠 Quick start](#-quick-start) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🤖 Models & free tier](#-models--free-tier) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🔌 9Router](#-connect-to-9router) · [🐞 Issues](#-issues)

</div>

---

## ✨ Why this exists

EnlyAI hands out a **500,000,000,000-unit welcome quota per account** and mints the first API key over plain REST — **no e-mail, no captcha, no card, no browser**. That makes one account per key the natural unit, and this tool turns that into a `keys.txt` where every line survived a live chat call.

## 🤖 Models & free tier

`GET /v1/models` (with a key) serves 8 ids; the live-verified ones:

| Model ID | note |
| --- | --- |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` | reasoning model; 5/5 probe 200s, returns `reasoning_content`, real `logprobs`, working `tool_calls` |
| `enlyai-work` | the provider's default work model |
| `meta/muse-glimmer-30b` | intermittent under load — re-checked by `--verify-only` |

**How much is free:** the welcome quota measured on a fresh account: `GET /api/user/self` answers `quota: 500000000000` right after sign-up (units are the panel's own quota scale). The grant is per account, so `--count N` multiplies it. `minimaxai/minimax-m3` was retired upstream (410 Gone) — the tool never lists it.

## 🛠 Quick start

```bash
# clone or fork this repository, then:
cd enlyai-bulk-apikey

# 1) your proxy list, one per line (http://… or socks5://…)
printf 'http://127.0.0.1:8080\n' > proxies.txt

# 2) go
node src/launcher.js        # interactive
# or directly:
node src/cli.js --count 50
```

`keys.txt` (mirrored to `%USERPROFILE%\enlyai-keys.txt`) is written **only** after a live chat completion proves the key.

### 🖱️ The launcher

The launcher asks for the proxy list, count and verification model, remembers them in `launcher.config.json`, and runs the CLI with the right flags.

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
| `ENLYAI_PROXIES` | `proxies.txt` | pool file, one proxy per line |

## 🛰️ Behind a proxy

Every request leaves through a proxy line from your pool; a dead line fails that attempt and the tool moves on. `--screen` tests a fresh list against the host before a run.

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

## 🐞 Issues

If EnlyAI changes its signup shape or quota, the tool stops at that step and says so. **[Open an issue](../../issues)** with the command you ran and the exact output; PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey contributors

</div>
