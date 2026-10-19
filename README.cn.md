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

**批量创建 EnlyAI 账号并自动生成 API 密钥 —— OpenAI 兼容推理 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-8-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 验证可用](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么有这个项目

EnlyAI 为**每个账号发放 500,000,000,000 单位的欢迎额度**，并通过纯 REST 接口签发第一个 API 密钥 —— **无需邮箱、无需验证码、无需银行卡、无需浏览器**。因此"一个密钥对应一个账号"就成了自然的单位，而本工具把这一切变成一个 `keys.txt`，其中每一行都通过了真实聊天调用的验证。

## 🎁 免费额度 —— 你能拿到多少

**每个新账号都会获得 500,000,000,000 单位的欢迎额度** —— 无需邮箱、无需验证码、无需银行卡、无需浏览器。

| 项目 | 数值 |
| --- | --- |
| 欢迎额度 | **500,000,000,000 单位**（注册后立即 `GET /api/user/self` 返回的 `quota`） |
| 需要银行卡 | **否** |
| 注册方式 | 纯 REST —— 用户名 + 密码（邮箱字段可随意填写；不会发送任何验证码） |
| 可扩展的单位 | **一个账号 = 一个密钥** → `--count N` 实际上就是"N 个免费账号" |

> 💡 免费额度由 EnlyAI 设定，可能会变动。请到 [api.enlyai.com](https://api.enlyai.com) 查看实时数字 —— 并让工具自带的校验来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 —— 全部 8 个

`GET /v1/models`（带上密钥）返回 8 个 id；以下为经过实测验证的：

|模型|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|
|`enlyai-work`|✓|
|`google/diffusiongemma-26b-a4b-it`|✓|
|`meta/llama-3.2-11b-vision-instruct`|✓|
|`meta/muse-glimmer-30b`|✓|
|`nvidia/nemotron-3-super-120b-a12b`|✓|
|`nvidia/nemotron-3.5-lightning-30b-a3b`|✓|

**免费额度有多少：** 在一个全新账号上实测的欢迎额度：注册后立即 `GET /api/user/self` 会返回 `quota: 500000000000`（单位是面板自身的额度刻度）。额度按账号发放，所以 `--count N` 会成倍增加。`minimaxai/minimax-m3` 已在上游下线（410 Gone）—— 本工具从不列出它。

## 🧪 如何使用 API

基础 URL 是 **`https://api.enlyai.com/v1`** —— 兼容 OpenAI，因此任何支持 OpenAI 协议的工具都能用。

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

在任何 agent 或 SDK（Cursor、OpenCode、Kilo Code 等）中设置基础 URL，并选择上面任意一个模型 id。

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

`keys.txt`（同时镜像到 `%USERPROFILE%\enlyai-keys.txt`）**只有**在一次真实聊天补全验证了该密钥之后才会写入。

### 🖱️ 启动器

启动器会询问代理列表、数量和验证模型，把它们记住在 `launcher.config.json` 中，并用正确的参数运行 CLI。

## ✅ 验证可用 —— 每个密钥都经过测试

| 检查项 | 结果 |
| --- | --- |
| `POST /api/user/register` | **200** —— 任何步骤都不需要邮箱、手机、银行卡或验证码 |
| 欢迎额度 | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200**，响应中包含密钥 |
| `POST /v1/chat/completions` —— 在写入**每个**密钥之前都会执行 | **200**，返回真实内容（例如 nemotron 会返回 `reasoning_content`） |
| 未通过聊天检查的密钥 | 永远不会写入 `keys.txt` —— 该账号仍可在 `accounts.json` 中找回 |

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
| 状态 | `GET /api/status` | 可达性 + 门槛（记录为：`em:false, ts:false`） |
| 注册 | `POST /api/user/register {username,password,email}` | 邮箱只是一个普通字符串字段 —— 不会发送任何验证码 |
| 登录 | `POST /api/user/login` | 会话 cookie；后续令牌调用需要保留它 |
| 密钥 | `POST /api/token/ {name}` | 密钥在响应体中返回 |
| 检查 | `POST /v1/chat/completions` | 写入 `keys.txt` 前必须获得真实 200 |

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

每个请求都会经由你代理池中的一行代理发出；失效的代理会让该次尝试失败，工具则继续往下走。`--screen` 会在正式运行前用一份新列表对目标主机进行测试。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经实测验证的密钥 —— 已被 git 忽略 |
| `accounts.json` | 每个账号的用户名 / 密码 / uid / 密钥 / 聊天状态 |
| `proxies.txt` | 你的出口代理，每行一个 —— 已被 git 忽略 |
| `outputs/` | 运行状态 —— 已被 git 忽略 |

## 🔌 连接 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。注册一次该提供商，每个密钥都会成为同一个 provider 节点下的一个连接：

```bash
node src/connect-9router.js
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--name "EnlyAI"`、`--prefix enlyai`、`--base-url https://api.enlyai.com/v1`。之后模型会以 `enlyai/<model id>` 的形式提供，并在所有密钥之间做负载均衡。

## 🔑 一个密钥能带来什么

| | |
| --- | --- |
| 🏢 提供商 | **EnlyAI** —— [api.enlyai.com](https://api.enlyai.com) |
| 🎁 提供商提供什么 | 每个密钥一个账号 —— 无需邮箱，每个密钥都经过聊天验证 |
| 🔑 一个密钥能带来什么 | 一个绑定到自身账号的 API 密钥：下面端点上的 8 个模型 id，受你套餐的限制。额度归属于**账号**，这正是本工具为每个密钥创建一个账号的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 你的数据 | 只会联系 api.enlyai.com 和你配置的收件箱后端；密钥始终留在你自己的机器上 |

## 🐞 问题反馈

如果 EnlyAI 改变了注册形式或额度，工具会在那一步停下并给出提示。请**[提交 issue](../../issues)**，附上你运行的命令和完整输出；欢迎 PR。

## 📄 许可证

MIT © 2026 —— 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey 贡献者

</div>

## ⚡ 运行形态（预设）

`--preset=turbo|balanced|safe` 设置工作线程数 + 账号之间的暂停时间（turbo = 5，balanced = 4，safe = 2）；显式指定的 `--conc`/`--gap`（或仓库自带的参数）始终优先，并且在不加 `--preset` 时，工具会完全保持其历史上的运行形态。

推荐使用 Turbo（5 个 worker）；再往上会在性能较弱的电脑上带来负载/封禁风险。