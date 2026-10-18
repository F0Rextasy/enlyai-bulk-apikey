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

**EnlyAI-Konten in großen Mengen erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz + 9Router-Konnektor.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-8-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ Warum es das gibt

EnlyAI verteilt ein **Willkommenskontingent von 500.000.000.000 Einheiten pro Konto** und erstellt den ersten API-Schlüssel über reines REST — **keine E-Mail, kein Captcha, keine Karte, kein Browser**. Das macht ein Konto pro Schlüssel zur natürlichen Einheit, und dieses Tool verwandelt das in eine `keys.txt`, in der jede Zeile einen Live-Chat-Aufruf überstanden hat.

## 🎁 Kostenlose Stufe — wie viel du bekommst

**Jedes neue Konto erhält ein Willkommenskontingent von 500.000.000.000 Einheiten** — keine E-Mail, kein Captcha, keine Karte, kein Browser.

| Was | Wert |
| --- | --- |
| Willkommenskontingent | **500.000.000.000 Einheiten** (`quota` bei `GET /api/user/self` direkt nach der Registrierung) |
| Karte erforderlich | **Nein** |
| Registrierung | reines REST — Benutzername + Passwort (das E-Mail-Feld ist frei wählbar; es wird nie ein Code versendet) |
| Die skalierende Einheit | **ein Konto = ein Schlüssel** → `--count N` bedeutet wirklich „N kostenlose Konten" |

> 💡 Die kostenlose Stufe wird von EnlyAI festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [api.enlyai.com](https://api.enlyai.com) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 8

`GET /v1/models` (mit einem Schlüssel) liefert 8 IDs; die live verifizierten:

|Modell|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|

**Wie viel kostenlos ist:** das Willkommenskontingent, gemessen an einem frischen Konto: `GET /api/user/self` antwortet direkt nach der Registrierung mit `quota: 500000000000` (die Einheiten folgen der eigenen Kontingent-Skala des Panels). Die Gewährung erfolgt pro Konto, daher multipliziert `--count N` sie. `minimaxai/minimax-m3` wurde upstream eingestellt (410 Gone) — das Tool listet es nie auf.

## 🧪 Die API verwenden

Die Basis-URL ist **`https://api.enlyai.com/v1`** — OpenAI-kompatibel, also funktioniert alles, was OpenAI spricht.

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Setze die Basis-URL in jedem Agenten oder SDK (Cursor, OpenCode, Kilo Code, …) und wähle eine beliebige Modell-ID von oben.

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

`keys.txt` (gespiegelt nach `%USERPROFILE%\enlyai-keys.txt`) wird **erst** geschrieben, nachdem eine Live-Chat-Vervollständigung den Schlüssel bestätigt hat.

### 🖱️ Der Launcher

Der Launcher fragt nach der Proxy-Liste, der Anzahl und dem Verifizierungsmodell, merkt sie sich in `launcher.config.json` und führt die CLI mit den richtigen Flags aus.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `POST /api/user/register` | **200** — kein E-Mail-, Telefon-, Karten- oder Captcha-Schritt |
| Willkommenskontingent | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200** mit dem Schlüssel in der Antwort |
| `POST /v1/chat/completions` — für **jeden** Schlüssel ausgeführt, bevor er geschrieben wird | **200** mit echtem Inhalt (z. B. antwortet nemotron mit `reasoning_content`) |
| ein Schlüssel, der seine Chat-Prüfung nicht besteht | wird nie in `keys.txt` geschrieben — das Konto bleibt in `accounts.json` wiederherstellbar |

Jederzeit erneut prüfen:

```bash
node src/cli.js --verify-only
```

## 🧭 So funktioniert es

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
| Status | `GET /api/status` | Erreichbarkeit + Gates (aufgezeichnet: `em:false, ts:false`) |
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

Jede Anfrage verlässt das System über eine Proxy-Zeile aus deinem Pool; eine tote Zeile lässt diesen Versuch scheitern und das Tool macht weiter. `--screen` testet eine frische Liste gegen den Host vor einem Durchlauf.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | Benutzername / Passwort / uid / Schlüssel / Chat-Status pro Konto |
| `proxies.txt` | deine Ausgänge, einer pro Zeile — von Git ignoriert |
| `outputs/` | Ausführungszustand — von Git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Registriere diesen Anbieter einmal und jeder Schlüssel wird zu einer Verbindung unter einem Anbieter-Knoten:

```bash
node src/connect-9router.js
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--name "EnlyAI"`, `--prefix enlyai`, `--base-url https://api.enlyai.com/v1`. Modelle werden dann als `enlyai/<model id>` bereitgestellt und über alle Schlüssel lastverteilt.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 Was der Anbieter gibt | ein Konto pro Schlüssel — ohne E-Mail, jeder Schlüssel chat-verifiziert |
| 🔑 Was ein Schlüssel dir bringt | ein API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 8 Modell-IDs am unten stehenden Endpunkt, im Rahmen der Limits deines Tarifs. Das Kontingent liegt beim **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 Deine Daten | nur api.enlyai.com und das von dir konfigurierte Inbox-Backend werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Wenn EnlyAI seine Registrierungsform oder sein Kontingent ändert, stoppt das Tool an diesem Schritt und sagt es dir. **[Öffne ein Issue](../../issues)** mit dem ausgeführten Befehl und der exakten Ausgabe; PRs sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey contributors

</div>

## ⚡ Ausführungsform (Presets)

`--preset=turbo|balanced|safe` legt Worker + die Pause zwischen Konten fest (turbo = 5,
balanced = 4, safe = 2); explizite `--conc`/`--gap` (oder die eigenen Flags des Repos) gewinnen immer,
und ohne `--preset` behält das Tool exakt seine bisherige Form.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.