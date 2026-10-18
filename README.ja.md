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

**自動生成された API キーで EnlyAI アカウントを一括作成 — OpenAI 互換の推論 + 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-8-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ これが存在する理由

EnlyAI は**アカウントごとに 500,000,000,000 ユニットのウェルカムクォータ**を配布し、最初の API キーをプレーンな REST 経由で発行します — **メール不要、キャプチャ不要、カード不要、ブラウザ不要**。そのため 1 アカウント 1 キーが自然な単位となり、このツールはそれを `keys.txt` に変換します。そこではすべての行が実際のチャット呼び出しを通過しています。

## 🎁 無料枠 — どれだけ得られるか

**すべての新規アカウントに 500,000,000,000 ユニットのウェルカムクォータが付与されます** — メール不要、キャプチャ不要、カード不要、ブラウザ不要。

| 項目 | 値 |
| --- | --- |
| ウェルカムクォータ | **500,000,000,000 ユニット**（登録直後の `GET /api/user/self` の `quota`） |
| カード必須 | **いいえ** |
| 登録 | プレーンな REST — ユーザー名 + パスワード（メール欄は自由入力。コードは一切送信されません） |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は実質「N 個の無料アカウント」 |

> 💡 無料枠は EnlyAI が設定するもので、変更される可能性があります。最新の数値は [api.enlyai.com](https://api.enlyai.com) で確認してください — そしてツール自身のゲートに判断を委ねましょう:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全 8 種類

`GET /v1/models`（キー付き）は 8 個の id を返します。実際に検証済みのもの:

|Model|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|

**無料でどれだけ使えるか:** 新規アカウントで計測されたウェルカムクォータ: `GET /api/user/self` は登録直後に `quota: 500000000000` を返します（単位はパネル独自のクォータスケールです）。付与はアカウント単位なので、`--count N` でそれが倍増します。`minimaxai/minimax-m3` は上流で廃止されました（410 Gone）— ツールはそれを一切リストしません。

## 🧪 API の使い方

ベース URL は **`https://api.enlyai.com/v1`** — OpenAI 互換なので、OpenAI を扱えるものなら何でも動作します。

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

任意のエージェントや SDK（Cursor、OpenCode、Kilo Code など）でベース URL を設定し、上記の任意のモデル id を選んでください。

## 🛠 クイックスタート

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

`keys.txt`（`%USERPROFILE%\enlyai-keys.txt` にミラーリング）は、実際のチャット補完がキーを証明した**後にのみ**書き込まれます。

### 🖱️ ランチャー

ランチャーはプロキシリスト、件数、検証モデルを尋ね、それらを `launcher.config.json` に記憶し、適切なフラグで CLI を実行します。

## ✅ 動作検証済み — すべてのキーがテストされます

| チェック | 結果 |
| --- | --- |
| `POST /api/user/register` | **200** — どのステップでもメール、電話、カード、キャプチャ不要 |
| ウェルカムクォータ | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200**、レスポンスにキーが含まれる |
| `POST /v1/chat/completions` — 書き込まれる前に**すべての**キーに対して実行 | **200**、実際のコンテンツ付き（例: nemotron は `reasoning_content` で応答） |
| チャットチェックに失敗したキー | `keys.txt` には決して書き込まれない — アカウントは `accounts.json` で復元可能なまま |

いつでも再チェック:

```bash
node src/cli.js --verify-only
```

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: EnlyAI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.enlyai.com/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| ステータス | `GET /api/status` | 到達性 + ゲート（記録: `em:false, ts:false`） |
| 登録 | `POST /api/user/register {username,password,email}` | メールは単なる文字列フィールド — コードは一切送信されない |
| サインイン | `POST /api/user/login` | セッションクッキー。トークン呼び出しのために保持する |
| キー | `POST /api/token/ {name}` | キーはレスポンスボディで返される |
| チェック | `POST /v1/chat/completions` | `keys.txt` の前に実際の 200 が必要 |

## ⚙️ CLI オプション

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | プールファイル、1 行につき 1 プロキシ |

## 🛰️ プロキシの背後で

すべてのリクエストはプール内のプロキシ行を通って出ていきます。死んだ行はその試行を失敗させ、ツールは次に進みます。`--screen` は実行前に新しいリストをホストに対してテストします。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行につき 1 つの検証済みキー — git 無視 |
| `accounts.json` | アカウントごとのユーザー名 / パスワード / uid / キー / チャットステータス |
| `proxies.txt` | あなたの出口、1 行に 1 つ — git 無視 |
| `outputs/` | 実行状態 — git 無視 |

## 🔌 9Router に接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。このプロバイダーを一度登録すれば、すべてのキーが 1 つのプロバイダーノードの下の接続になります:

```bash
node src/connect-9router.js
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--name "EnlyAI"`、`--prefix enlyai`、`--base-url https://api.enlyai.com/v1`。モデルは `enlyai/<model id>` として提供され、すべてのキー間で負荷分散されます。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 プロバイダーが提供するもの | 1 アカウントにつき 1 キー — メール不要、すべてのキーがチャット検証済み |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー: 下記エンドポイントの 8 個のモデル id を、あなたのプランの制限内で。クォータは**アカウント**に存在するため、このツールが 1 キーにつき 1 アカウントを作成するのです |
| 🌐 API 形式 | OpenAI 互換: `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのは api.enlyai.com と、あなたが設定した inbox バックエンドのみ。キーはあなたのマシンに留まります |

## 🐞 問題報告

EnlyAI が登録の形式やクォータを変更した場合、ツールはそのステップで停止し、その旨を報告します。実行したコマンドと正確な出力を添えて**[issue を作成してください](../../issues)**。PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey contributors

</div>

## ⚡ 実行形態（プリセット）

`--preset=turbo|balanced|safe` はワーカー数 + アカウント間のポーズを設定します（turbo = 5、
balanced = 4、safe = 2）。明示的な `--conc`/`--gap`（またはリポジトリ独自のフラグ）が常に優先され、
`--preset` なしの場合、ツールは従来の形態を正確に保ちます。

Turbo が推奨されます（5 ワーカー）。それ以上は非力なコンピューターでは負荷/ban のリスクがあります。