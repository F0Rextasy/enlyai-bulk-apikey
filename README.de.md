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

**EnlyAI-Konten im Bulk erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-8-of-them) · [🧪 API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 Wie es funktioniert](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

EnlyAI verteilt ein **Willkommens-Kontingent von 500.000.000.000 Einheiten pro Konto** und erzeugt den ersten API-Schlüssel über reines REST — **keine E-Mail, kein Captcha, keine Karte, kein Browser**. Damit ist ein Konto pro Schlüssel die natürliche Einheit, und dieses Tool macht daraus eine `keys.txt`, in der jede Zeile einen echten Chat-Aufruf überlebt hat.

## 🎁 Kostenlose Stufe — wie viel du bekommst

**Jedes neue Konto erhält ein Willkommens-Kontingent von 500.000.000.000 Einheiten** — keine E-Mail, kein Captcha, keine Karte, kein Browser.

| Was | Wert |
| --- | --- |
| Willkommens-Kontingent | **500.000.000.000 Einheiten** (`quota` bei `GET /api/user/self` direkt nach der Registrierung) |
| Karte erforderlich | **Nein** |
| Registrierung | reines REST — Benutzername + Passwort (das E-Mail-Feld ist Freitext; es wird nie ein Code versendet) |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** → `--count N` bedeutet wirklich „N kostenlose Konten“ |

> 💡 Die kostenlose Stufe wird von EnlyAI festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [api.enlyai.com](https://api.enlyai.com) — und lass die Prüfung des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 8

`GET /v1/models` (mit einem Schlüssel) liefert 8 IDs; die live verifizierten:

|Modell|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|
|`enlyai-work`|✓|
|`google/diffusiongemma-26b-a4b-it`|✓|
|`meta/llama-3.2-11b-vision-instruct`|✓|
|`meta/muse-glimmer-30b`|✓|
|`nvidia/nemotron-3-super-120b-a12b`|✓|
|`nvidia/nemotron-3.5-lightning-30b-a3b`|✓|

**Wie viel kostenlos ist:** das Willkommens-Kontingent, gemessen an einem frischen Konto: `GET /api/user/self` antwortet direkt nach der Registrierung mit `quota: 500000000000` (die Einheiten folgen der eigenen Quota-Skala des Panels). Die Vergabe erfolgt pro Konto, `--count N` vervielfacht sie also. `minimaxai/minimax-m3` wurde upstream eingestellt (410 Gone) — das Tool listet es nie auf.

## 🧪 So verwendest du die API

Die Basis-URL ist **`https://api.enlyai.com/v1`** — OpenAI-kompatibel, also funktioniert alles, was OpenAI spricht.

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Setze die Basis-URL in einem beliebigen Agenten oder SDK (Cursor, OpenCode, Kilo Code, …) und wähle eine beliebige Modell-ID von oben.

## 🛠 Schnellstart

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

`keys.txt` (gespiegelt nach `%USERPROFILE%\enlyai-keys.txt`) wird **erst** geschrieben, nachdem eine echte Chat-Completion den Schlüssel bestätigt hat.

### 🖱️ Der Launcher

Der Launcher fragt nach Proxy-Liste, Anzahl und Verifizierungsmodell, merkt sie sich in `launcher.config.json` und startet die CLI mit den passenden Flags.

## ✅ Verifiziert funktionsfähig — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `POST /api/user/register` | **200** — zu keinem Zeitpunkt E-Mail, Telefon, Karte oder Captcha |
| Willkommens-Kontingent | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200** mit dem Schlüssel in der Antwort |
| `POST /v1/chat/completions` — wird für **jeden** Schlüssel ausgeführt, bevor er geschrieben wird | **200** mit echtem Inhalt (z. B. antwortet nemotron mit `reasoning_content`) |
| ein Schlüssel, der seine Chat-Prüfung nicht besteht | wird nie in `keys.txt` geschrieben — das Konto bleibt in `accounts.json` wiederherstellbar |

Jederzeit erneut prüfen:

```bash
node src/cli.js --verify-only
```

## 🧭 Wie es funktioniert

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: EnlyAI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.enlyai.com/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Status | `GET /api/status` | Erreichbarkeit + Gates (erfasst: `em:false, ts:false`) |
| Registrierung | `POST /api/user/register {username,password,email}` | E-Mail ist ein einfaches String-Feld — es wird nie ein Code versendet |
| Anmeldung | `POST /api/user/login` | Session-Cookie; für die Token-Aufrufe behalten |
| Schlüssel | `POST /api/token/ {name}` | Schlüssel wird im Antwort-Body zurückgegeben |
| Prüfung | `POST /v1/chat/completions` | Live-200 erforderlich, bevor `keys.txt` geschrieben wird |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| Umgebungsvariable | Standard | Bedeutung |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | Pool-Datei, ein Proxy pro Zeile |

## 🛰️ Hinter einem Proxy

Jede Anfrage verlässt deinen Rechner über eine Proxy-Zeile aus deinem Pool; eine tote Zeile lässt diesen Versuch scheitern und das Tool macht weiter. `--screen` testet eine frische Liste vor einem Lauf gegen den Host.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | Benutzername / Passwort / UID / Schlüssel / Chat-Status pro Konto |
| `proxies.txt` | deine Ausgänge, einer pro Zeile — von Git ignoriert |
| `outputs/` | Laufzeitzustand — von Git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Registriere diesen Provider einmal, und jeder Schlüssel wird zu einer Verbindung unter einem Provider-Knoten:

```bash
node src/connect-9router.js
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--name "EnlyAI"`, `--prefix enlyai`, `--base-url https://api.enlyai.com/v1`. Modelle werden dann als `enlyai/<model id>` ausgeliefert und über alle Schlüssel lastverteilt.

## 🔌 Mit OmniRoute verbinden

[OmniRoute](https://omniroute.online) ist ein selbst gehosteter, OpenAI-kompatibler Router. Registriere diesen Provider einmal, und jeder Schlüssel wird zu einer Verbindung unter einem Provider-Knoten:

```bash
node src/connect-omniroute.js
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--name "EnlyAI"`, `--prefix enlyai`, `--base-url https://api.enlyai.com/v1`. Modelle werden dann als `enlyai/<model id>` ausgeliefert und über alle Schlüssel lastverteilt.
## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 Was der Anbieter gibt | ein Konto pro Schlüssel — ohne E-Mail, jeder Schlüssel chat-verifiziert |
| 🔑 Was ein Schlüssel dir bringt | ein API-Schlüssel, gebunden an sein eigenes Konto: die 8 Modell-IDs am unten stehenden Endpoint, zu den Limits deines Plans. Das Kontingent hängt am **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 Deine Daten | kontaktiert werden nur api.enlyai.com und das von dir konfigurierte Inbox-Backend; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Wenn EnlyAI die Form der Registrierung oder das Kontingent ändert, stoppt das Tool an diesem Schritt und sagt es. **[Eröffne ein Issue](../../issues)** mit dem Befehl, den du ausgeführt hast, und der exakten Ausgabe; PRs sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 Mitwirkende von enlyai-bulk-apikey

</div>

## ⚡ Lauf-Form (Presets)

`--preset=turbo|balanced|safe` legt die Worker-Anzahl + die Pause zwischen Konten fest (turbo = 5,
balanced = 4, safe = 2); explizite `--conc`/`--gap` (oder die eigenen Flags des Repos) gewinnen immer,
und ohne `--preset` behält das Tool exakt seine bisherige Form.

Turbo wird empfohlen (5 Worker); mehr bedeutet auf schwachen Rechnern Last-/Ban-Risiko.