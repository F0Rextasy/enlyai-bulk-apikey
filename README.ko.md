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

**자동 생성 API 키로 EnlyAI 계정을 대량 생성 — OpenAI 호환 추론 + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-8-of-them) · [🧪 API 사용](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 왜 이 도구가 있나

EnlyAI는 **계정당 500,000,000,000단위의 웰컴 쿼터**를 제공하고, 첫 API 키를 순수 REST로 발급합니다 — 이메일, 캡차, 카드, 브라우저가 필요 없습니다. 따라서 키당 계정 하나가 자연스러운 단위가 되며, 이 도구는 이를 모든 줄이 실제 채팅 호출을 통과한 `keys.txt`로 바꿉니다.

## 🎁 무료 티어 — 얼마나 받나요

**모든 새 계정은 500,000,000,000단위의 웰컴 쿼터를 받습니다** — 이메일, 캡차, 카드, 브라우저가 필요 없습니다.

| 항목 | 값 |
| --- | --- |
| 웰컴 쿼터 | **500,000,000,000단위** (가입 직후 `GET /api/user/self`의 `quota`) |
| 카드 필요 | **아니요** |
| 가입 | 순수 REST — 사용자 이름 + 비밀번호(이메일 필드는 자유 형식이며, 어떤 코드도 전송되지 않습니다) |
| 확장 단위 | **계정 하나 = 키 하나** → `--count N`은 실제로 "무료 계정 N개"입니다 |

> 💡 무료 티어는 EnlyAI가 설정하며 변경될 수 있습니다. [api.enlyai.com](https://api.enlyai.com)에서 실시간 수치를 확인하고, 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 전체 8개

`GET /v1/models`(키 사용)는 8개 ID를 제공합니다. 실시간 검증된 항목은 다음과 같습니다:

|모델|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|
|`enlyai-work`|✓|
|`google/diffusiongemma-26b-a4b-it`|✓|
|`meta/llama-3.2-11b-vision-instruct`|✓|
|`meta/muse-glimmer-30b`|✓|
|`nvidia/nemotron-3-super-120b-a12b`|✓|
|`nvidia/nemotron-3.5-lightning-30b-a3b`|✓|

**무료로 얼마나 쓸 수 있나:** 새 계정에서 측정한 웰컴 쿼터: 가입 직후 `GET /api/user/self`가 `quota: 500000000000`을 응답합니다(단위는 패널 자체의 쿼터 스케일입니다). 지급량은 계정당이므로 `--count N`은 이를 배수로 늘립니다. `minimaxai/minimax-m3`는 업스트림에서 종료되었습니다(410 Gone) — 이 도구는 이를 나열하지 않습니다.

## 🧪 API 사용 방법

기본 URL은 **`https://api.enlyai.com/v1`** 입니다 — OpenAI 호환이므로 OpenAI를 지원하는 모든 것이 작동합니다.

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

어떤 에이전트나 SDK(Cursor, OpenCode, Kilo Code, …)에서든 기본 URL을 설정하고 위의 모델 ID 중 하나를 선택하세요.

## 🛠 빠른 시작

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

`keys.txt`(`%USERPROFILE%\enlyai-keys.txt`에 미러링됨)는 실제 채팅 완료가 키를 증명한 **후에만** 기록됩니다.

### 🖱️ 런처

런처는 프록시 목록, 개수, 검증 모델을 묻고 이를 `launcher.config.json`에 기억한 뒤 올바른 플래그로 CLI를 실행합니다.

## ✅ 작동 검증됨 — 모든 키가 테스트됩니다

| 검사 | 결과 |
| --- | --- |
| `POST /api/user/register` | **200** — 어느 단계에서도 이메일, 전화번호, 카드 또는 캡차가 필요 없습니다 |
| 웰컴 쿼터 | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | 응답에 키 포함 **200** |
| `POST /v1/chat/completions` — 기록되기 전에 **모든** 키에 대해 실행 | 실제 콘텐츠 포함 **200**(예: nemotron은 `reasoning_content`로 응답) |
| 채팅 검사를 통과하지 못한 키 | `keys.txt`에 절대 기록되지 않음 — 계정은 `accounts.json`에서 복구 가능한 상태로 유지됩니다 |

언제든지 다시 확인:

```bash
node src/cli.js --verify-only
```

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: EnlyAI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.enlyai.com/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 상태 | `GET /api/status` | 연결 가능성 + 게이트(기록됨: `em:false, ts:false`) |
| 가입 | `POST /api/user/register {username,password,email}` | 이메일은 일반 문자열 필드입니다 — 어떤 코드도 전송되지 않습니다 |
| 로그인 | `POST /api/user/login` | 세션 쿠키; 토큰 호출을 위해 유지하세요 |
| 키 | `POST /api/token/ {name}` | 키는 응답 본문에 반환됩니다 |
| 검사 | `POST /v1/chat/completions` | `keys.txt` 전에 실제 200 필요 |

## ⚙️ CLI 옵션

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| 환경 변수 | 기본값 | 의미 |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | 풀 파일, 한 줄에 프록시 하나 |

## 🛰️ 프록시 뒤에서

모든 요청은 풀의 프록시 줄을 통해 나갑니다. 죽은 줄은 해당 시도를 실패시키고 도구는 다음으로 넘어갑니다. `--screen`은 실행 전에 새 목록을 호스트에 대해 테스트합니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 실시간 검증된 키 하나 — git 무시됨 |
| `accounts.json` | 계정별 사용자 이름 / 비밀번호 / uid / 키 / 채팅 상태 |
| `proxies.txt` | 나가는 경로, 한 줄에 하나 — git 무시됨 |
| `outputs/` | 실행 상태 — git 무시됨 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 셀프 호스팅, OpenAI 호환 라우터입니다. 이 제공자를 한 번 등록하면 모든 키가 하나의 제공자 노드 아래 연결이 됩니다:

```bash
node src/connect-9router.js
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--name "EnlyAI"`, `--prefix enlyai`, `--base-url https://api.enlyai.com/v1`. 그러면 모델은 `enlyai/<model id>`로 제공되고 모든 키에 걸쳐 로드 밸런싱됩니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 제공자가 주는 것 | 키당 계정 하나 — 이메일 불필요, 모든 키 채팅 검증됨 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 범위가 지정된 API 키 하나: 아래 엔드포인트의 8개 모델 ID, 요금제 한도 내. 쿼터는 **계정**에 있으므로 이 도구가 키당 계정 하나를 만드는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 데이터 | api.enlyai.com과 구성한 받은편지함 백엔드에만 접속하며, 키는 사용자 컴퓨터에 남습니다 |

## 🐞 이슈

EnlyAI가 가입 형태나 쿼터를 변경하면 도구는 해당 단계에서 멈추고 그 사실을 알립니다. 실행한 명령과 정확한 출력을 포함해 **[이슈를 열어 주세요](../../issues)**; PR을 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey 기여자

</div>

## ⚡ 실행 형태(프리셋)

`--preset=turbo|balanced|safe`는 워커 수 + 계정 간 일시정지를 설정합니다(turbo = 5, balanced = 4, safe = 2). 명시적 `--conc`/`--gap`(또는 저장소 자체 플래그)이 항상 우선하며, `--preset`이 없으면 도구는 기존 형태를 그대로 유지합니다.

Turbo 권장(워커 5개); 더 많으면 약한 컴퓨터에서 부하/차단 위험이 있습니다.