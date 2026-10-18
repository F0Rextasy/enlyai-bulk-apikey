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

**Массовое создание аккаунтов EnlyAI с автоматически сгенерированными API-ключами — инференс, совместимый с OpenAI, + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-8-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ Зачем это нужно

EnlyAI выдаёт **приветственную квоту в 500 000 000 000 единиц на каждый аккаунт** и создаёт первый API-ключ через обычный REST — **без e-mail, без капчи, без карты, без браузера**. Это делает один аккаунт на ключ естественной единицей, и этот инструмент превращает это в `keys.txt`, где каждая строка прошла проверку живым вызовом чата.

## 🎁 Бесплатный тариф — сколько вы получаете

**Каждый новый аккаунт получает приветственную квоту в 500 000 000 000 единиц** — без e-mail, без капчи, без карты, без браузера.

| Что | Значение |
| --- | --- |
| Приветственная квота | **500 000 000 000 единиц** (`quota` в `GET /api/user/self` сразу после регистрации) |
| Требуется карта | **Нет** |
| Регистрация | обычный REST — имя пользователя + пароль (поле e-mail свободного формата; код никогда не отправляется) |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` на самом деле означает «N бесплатных аккаунтов» |

> 💡 Бесплатный тариф устанавливается EnlyAI и может измениться. Проверяйте актуальные цифры на [api.enlyai.com](https://api.enlyai.com) — и пусть собственный контроль инструмента решит:

```bash
node src/cli.js --verify-only     # каждый ключ в keys.txt перепроверяется реальным вызовом чата
```

## 🤖 Модели — все 8

`GET /v1/models` (с ключом) отдаёт 8 идентификаторов; проверенные вживую:

|Модель|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|

**Сколько бесплатно:** приветственная квота, измеренная на свежем аккаунте: `GET /api/user/self` отвечает `quota: 500000000000` сразу после регистрации (единицы — это собственная шкала квоты панели). Грант выдаётся на аккаунт, поэтому `--count N` умножает его. `minimaxai/minimax-m3` был выведен из эксплуатации на стороне провайдера (410 Gone) — инструмент его никогда не показывает.

## 🧪 Как использовать API

Базовый URL — **`https://api.enlyai.com/v1`** — совместим с OpenAI, поэтому работает всё, что говорит на языке OpenAI.

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Укажите базовый URL в любом агенте или SDK (Cursor, OpenCode, Kilo Code, …) и выберите любой идентификатор модели выше.

## 🛠 Быстрый старт

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

`keys.txt` (зеркалируется в `%USERPROFILE%\enlyai-keys.txt`) записывается **только** после того, как живое завершение чата подтвердит ключ.

### 🖱️ Лаунчер

Лаунчер запрашивает список прокси, количество и модель для проверки, запоминает их в `launcher.config.json` и запускает CLI с нужными флагами.

## ✅ Проверено в работе — каждый ключ тестируется

| Проверка | Результат |
| --- | --- |
| `POST /api/user/register` | **200** — ни e-mail, ни телефона, ни карты, ни капчи ни на одном шаге |
| приветственная квота | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200** с ключом в ответе |
| `POST /v1/chat/completions` — выполняется для **каждого** ключа перед записью | **200** с реальным содержимым (например, nemotron отвечает с `reasoning_content`) |
| ключ, не прошедший проверку чата | никогда не записывается в `keys.txt` — аккаунт остаётся восстановимым в `accounts.json` |

Перепроверить в любой момент:

```bash
node src/cli.js --verify-only
```

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: EnlyAI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.enlyai.com/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| статус | `GET /api/status` | доступность + шлюзы (зафиксировано: `em:false, ts:false`) |
| регистрация | `POST /api/user/register {username,password,email}` | e-mail — обычное строковое поле, код никогда не отправляется |
| вход | `POST /api/user/login` | сессионная cookie; сохраните её для вызовов токена |
| ключ | `POST /api/token/ {name}` | ключ возвращается в теле ответа |
| проверка | `POST /v1/chat/completions` | требуется живой 200 перед записью в `keys.txt` |

## ⚙️ Опции CLI

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| Переменная окружения | По умолчанию | Значение |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | файл пула, один прокси на строку |

## 🛰️ За прокси

Каждый запрос уходит через строку прокси из вашего пула; мёртвая строка проваливает эту попытку, и инструмент двигается дальше. `--screen` тестирует свежий список против хоста перед запуском.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный вживую ключ на строку — игнорируется git |
| `accounts.json` | имя пользователя / пароль / uid / ключ / статус чата для каждого аккаунта |
| `proxies.txt` | ваши выходы, один на строку — игнорируется git |
| `outputs/` | состояние запуска — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI. Зарегистрируйте этого провайдера один раз, и каждый ключ станет соединением под одним узлом-провайдером:

```bash
node src/connect-9router.js
```

По умолчанию: `--base http://localhost:20128`, `--password 123456`, `--name "EnlyAI"`, `--prefix enlyai`, `--base-url https://api.enlyai.com/v1`. Затем модели подаются как `enlyai/<model id>` и балансируются между всеми ключами.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 Что даёт провайдер | один аккаунт на ключ — без e-mail, каждый ключ проверен чатом |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 8 идентификаторов моделей на указанном ниже эндпоинте, в пределах лимитов вашего тарифа. Квота хранится на **аккаунте**, и именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | совместим с OpenAI: `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 Ваши данные | контакт только с api.enlyai.com и настроенным вами бэкендом inbox; ключи остаются на вашей машине |

## 🐞 Проблемы

Если EnlyAI изменит форму регистрации или квоту, инструмент остановится на этом шаге и сообщит об этом. **[Откройте issue](../../issues)** с командой, которую вы запускали, и точным выводом; PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey contributors

</div>

## ⚡ Форма запуска (пресеты)

`--preset=turbo|balanced|safe` задаёт количество воркеров + паузу между аккаунтами (turbo = 5,
balanced = 4, safe = 2); явные `--conc`/`--gap` (или собственные флаги репозитория) всегда
имеют приоритет, а без `--preset` инструмент сохраняет свою историческую форму в точности.

Рекомендуется turbo (5 воркеров); больше — риск нагрузки/бана на слабом компьютере.