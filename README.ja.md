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

**API キーを自動生成して EnlyAI アカウントを一括作成 — OpenAI 互換の推論 + 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-8-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ なぜこれがあるのか

EnlyAI は **アカウントごとに 500,000,000,000 ユニットのウェルカムクォータ**を付与し、最初の API キーを素の REST で発行します — **メール不要、キャプチャ不要、カード不要、ブラウザ不要**。つまり「1キーにつき1アカウント」が自然な単位であり、このツールはそれを `keys.txt` に変えます。そこにある各行は、実際のチャット呼び出しを生き延びたものだけです。

## 🎁 無料枠 — どれだけもらえるか

**新しいアカウントにはすべて 500,000,000,000 ユニットのウェルカムクォータが付与されます** — メール不要、キャプチャ不要、カード不要、ブラウザ不要。

| 項目 | 値 |
| --- | --- |
| ウェルカムクォータ | **500,000,000,000 ユニット**（登録直後の `GET /api/user/self` の `quota`） |
| カードの要求 | **なし** |
| 登録 | 素の REST — ユーザー名 + パスワード（メール欄は自由入力で、コードは一切送信されません） |
| スケールする単位 | **1アカウント = 1キー** → `--count N` は実質「無料アカウント N 個」 |

> 💡 無料枠は EnlyAI 側が設定するものであり、変更される可能性があります。最新の数値は [api.enlyai.com](https://api.enlyai.com) で確認してください — そして最終判断はツール自身のゲートに任せましょう:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全8種

`GET /v1/models`（キー付き）は8つの id を返します。実際に検証済みのものは次のとおりです:

|Model|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|
|`enlyai-work`|✓|
|`google/diffusiongemma-26b-a4b-it`|✓|
|`meta/llama-3.2-11b-vision-instruct`|✓|
|`meta/muse-glimmer-30b`|✓|
|`nvidia/nemotron-3-super-120b-a12b`|✓|
|`nvidia/nemotron-3.5-lightning-30b-a3b`|✓|

**無料で使える量:** 新規アカウントで実測したウェルカムクォータでは、登録直後に `GET /api/user/self` が `quota: 500000000000` を返します（単位はパネル独自のクォータ尺度です）。付与はアカウント単位なので、`--count N` でそれが掛け算になります。`minimaxai/minimax-m3` は上流で廃止されたため（410 Gone）、ツールがこれを一覧に出すことはありません。

## 🧪 API の使い方

ベース URL は **`https://api.enlyai.com/v1`** です — OpenAI 互換なので、OpenAI に対応するものなら何でも動作します。

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

任意のエージェントや SDK（Cursor、OpenCode、Kilo Code など）でベース URL を設定し、上記のいずれかのモデル id を選んでください。

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

`keys.txt`（`%USERPROFILE%\enlyai-keys.txt` にもミラーされます）は、実際のチャット補完によってキーが有効だと証明された**後にのみ**書き出されます。

### 🖱️ ランチャー

ランチャーはプロキシリスト、件数、検証用モデルを尋ね、それらを `launcher.config.json` に記憶し、適切なフラグを付けて CLI を実行します。

## ✅ 動作検証済み — すべてのキーがテストされます

| チェック | 結果 |
| --- | --- |
| `POST /api/user/register` | **200** — どのステップでもメール、電話番号、カード、キャプチャは不要 |
| ウェルカムクォータ | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | レスポンスにキーを含めて **200** |
| `POST /v1/chat/completions` — 書き出し前に**すべての**キーで実行 | 実コンテンツ付きで **200**（例: nemotron は `reasoning_content` で応答） |
| チャットチェックに失敗したキー | `keys.txt` には書き出されません — アカウントは `accounts.json` 内で復元可能なまま残ります |

いつでも再チェックできます:

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
| ステータス | `GET /api/status` | 到達性とゲート（記録: `em:false, ts:false`） |
| 登録 | `POST /api/user/register {username,password,email}` | メールは単なる文字列フィールド — コードは一切送信されません |
| サインイン | `POST /api/user/login` | セッション Cookie。トークン呼び出しのために保持します |
| キー | `POST /api/token/ {name}` | キーはレスポンスボディで返されます |
| チェック | `POST /v1/chat/completions` | `keys.txt` の前に実際の 200 応答が必要 |

## ⚙️ CLI オプション

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | プールファイル、1行につき1プロキシ |

## 🛰️ プロキシ経由で使う

すべてのリクエストはプール内のプロキシ行を経由して送信されます。死んだ行はその試行を失敗させ、ツールは次へ進みます。`--screen` は実行前に新しいリストをホストに対してテストします。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 実際に検証済みのキーが1行に1つ — git 管理対象外 |
| `accounts.json` | アカウントごとのユーザー名 / パスワード / uid / キー / チャット状態 |
| `proxies.txt` | 出口プロキシ、1行に1つ — git 管理対象外 |
| `outputs/` | 実行状態 — git 管理対象外 |

## 🔌 9Router への接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。このプロバイダを一度登録すれば、すべてのキーが1つのプロバイダノード配下の接続になります:

```bash
node src/connect-9router.js
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--name "EnlyAI"`、`--prefix enlyai`、`--base-url https://api.enlyai.com/v1`。モデルは `enlyai/<model id>` として提供され、すべてのキーに負荷分散されます。

## 🔌 OmniRoute への接続

[OmniRoute](https://omniroute.online) はセルフホスト型の OpenAI 互換ルーターです。このプロバイダを一度登録すれば、すべてのキーが1つのプロバイダノード配下の接続になります:

```bash
node src/connect-omniroute.js
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--name "EnlyAI"`、`--prefix enlyai`、`--base-url https://api.enlyai.com/v1`。モデルは `enlyai/<model id>` として提供され、すべてのキーに負荷分散されます。
## 🔑 1つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダ | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 プロバイダが提供するもの | キー1つにつきアカウント1つ — メール不要、すべてのキーはチャットで検証済み |
| 🔑 キー1つで得られるもの | 自身のアカウントに紐づく API キー1つ: 下記エンドポイントの8つのモデル id を、ご利用プランの上限内で。クォータは**アカウント**に存在するため、このツールがキー1つにつきアカウント1つを作成するのはまさにそのためです |
| 🌐 API 形式 | OpenAI 互換: `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 あなたのデータ | 接続先は api.enlyai.com と、設定した inbox バックエンドのみ。キーはあなたのマシン上に留まります |

## 🐞 問題報告

EnlyAI が登録の形式やクォータを変更した場合、ツールはそのステップで停止し、その旨を報告します。実行したコマンドと正確な出力を添えて **[issue を作成してください](../../issues)**。PR も歓迎です。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照してください。

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey contributors

</div>

## ⚡ 実行形態（プリセット）

`--preset=turbo|balanced|safe` はワーカー数とアカウント間のポーズを設定します（turbo = 5、balanced = 4、safe = 2）。明示的な `--conc`/`--gap`（またはリポジトリ独自のフラグ）が常に優先され、`--preset` を指定しない場合はツールは従来の形態をそのまま維持します。

Turbo を推奨します（5ワーカー）。それ以上は非力なマシンでは負荷や ban のリスクがあります。