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

**批量创建 EnlyAI 账户并自动生成 API 密钥 — 兼容 OpenAI 的推理 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-8-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ 为什么会有这个项目

EnlyAI 为**每个账户提供 500,000,000,000 单位的欢迎额度**，并通过纯 REST 接口签发第一个 API 密钥 — **无需邮箱、无需验证码、无需银行卡、无需浏览器**。这使得"一个账户对应一个密钥"成为天然的计量单位，而本工具将其转化为一个 `keys.txt`，其中每一行都通过了实时聊天调用的验证。

## 🎁 免费额度 — 你能获得多少

**每个新账户都会获得 500,000,000,000 单位的欢迎额度** — 无需邮箱、无需验证码、无需银行卡、无需浏览器。

| 项目 | 值 |
| --- | --- |
| 欢迎额度 | **500,000,000,000 单位**（注册后立即通过 `GET /api/user/self` 返回的 `quota`） |
| 是否需要银行卡 | **否** |
| 注册方式 | 纯 REST — 用户名 + 密码（邮箱字段为自由格式；不会发送任何验证码） |
| 可扩展的单位 | **一个账户 = 一个密钥** → `--count N` 实际上就是"N 个免费账户" |

> 💡 免费额度由 EnlyAI 设定，可能会发生变化。请在 [api.enlyai.com](https://api.enlyai.com) 查看实时数据 — 并让工具自身的校验来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 8 个

`GET /v1/models`（携带密钥）提供 8 个 id；其中经过实时验证的：

|Model|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|

**免费额度有多少：** 在全新账户上测得的欢迎额度：注册后立即通过 `GET /api/user/self` 返回 `quota: 500000000000`（单位是面板自身的额度刻度）。该额度按账户发放，因此 `--count N` 会将其倍增。`minimaxai/minimax-m3` 已在上游下线（410 Gone）— 本工具不会列出它。

## 🧪 如何使用 API

基础 URL 为 **`https://api.enlyai.com/v1`** — 兼容 OpenAI，因此任何支持 OpenAI 的工具都可以使用。

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

在任何代理或 SDK（Cursor、OpenCode、Kilo Code 等）中设置基础 URL，并选择上述任意模型 id。

## 🛠 快速开始

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

`keys.txt`（同步镜像到 `%USERPROFILE%\enlyai-keys.txt`）**只有**在实时聊天补全证明密钥有效后才会写入。

### 🖱️ 启动器

启动器会询问代理列表、数量和验证模型，将它们记录在 `launcher.config.json` 中，并使用正确的参数运行 CLI。

## ✅ 已验证可用 — 每个密钥都经过测试

| 检查项 | 结果 |
| --- | --- |
| `POST /api/user/register` | **200** — 任何步骤都无需邮箱、手机、银行卡或验证码 |
| 欢迎额度 | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200**，响应中包含密钥 |
| `POST /v1/chat/completions` — 在写入**每个**密钥前都会运行 | **200**，返回真实内容（例如 nemotron 会返回 `reasoning_content`） |
| 聊天检查失败的密钥 | 绝不会写入 `keys.txt` — 该账户仍可在 `accounts.json` 中恢复 |

随时重新检查：

```bash
node src/cli.js --verify-only
```

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: EnlyAI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.enlyai.com/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| 状态 | `GET /api/status` | 可达性 + 门控（记录为：`em:false, ts:false`） |
| 注册 | `POST /api/user/register {username,password,email}` | 邮箱是普通字符串字段 — 不会发送任何验证码 |
| 登录 | `POST /api/user/login` | 会话 cookie；保留它用于令牌调用 |
| 密钥 | `POST /api/token/ {name}` | 密钥在响应体中返回 |
| 检查 | `POST /v1/chat/completions` | 写入 `keys.txt` 前必须实时返回 200 |

## ⚙️ CLI 选项

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| 环境变量 | 默认值 | 含义 |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | 代理池文件，每行一个代理 |

## 🛰️ 在代理后面

每个请求都通过你代理池中的一行代理发出；失效的代理行会导致该次尝试失败，工具会继续下一个。`--screen` 会在运行前用一份新列表对主机进行测试。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经过实时验证的密钥 — 已被 git 忽略 |
| `accounts.json` | 每个账户的用户名 / 密码 / uid / 密钥 / 聊天状态 |
| `proxies.txt` | 你的出口代理，每行一个 — 已被 git 忽略 |
| `outputs/` | 运行状态 — 已被 git 忽略 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。注册一次此提供商，每个密钥都会成为同一个提供商节点下的一个连接：

```bash
node src/connect-9router.js
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--name "EnlyAI"`、`--prefix enlyai`、`--base-url https://api.enlyai.com/v1`。模型随后以 `enlyai/<model id>` 的形式提供，并在所有密钥之间进行负载均衡。

## 🔑 一个密钥能给你带来什么

| | |
| --- | --- |
| 🏢 提供商 | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 提供商提供什么 | 一个账户对应一个密钥 — 无需邮箱，每个密钥都经过聊天验证 |
| 🔑 一个密钥能给你带来什么 | 一个 API 密钥，作用域为其自身账户：下方端点上的 8 个模型 id，受你套餐的限制。额度存在于**账户**上，这正是本工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 api.enlyai.com 和你配置的收件箱后端；密钥保留在你的机器上 |

## 🐞 问题反馈

如果 EnlyAI 更改了其注册形态或额度，工具会在该步骤停止并说明原因。**[提交 issue](../../issues)** 时请附上你运行的命令和确切的输出；欢迎 PR。

## 📄 许可证

MIT © 2026 — 参见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey contributors

</div>

## ⚡ 运行形态（预设）

`--preset=turbo|balanced|safe` 设置 worker 数量 + 账户之间的暂停时间（turbo = 5，balanced = 4，safe = 2）；显式的 `--conc`/`--gap`（或仓库自身的标志）始终优先，且在没有 `--preset` 时，工具会完全保持其历史形态。

推荐使用 Turbo（5 个 worker）；更多则在性能较弱的电脑上有负载/封禁风险。