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

**Crea cuentas de EnlyAI en masa con claves API autogeneradas — inferencia compatible con OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-8-of-them) · [🧪 Usa la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ Por qué existe esto

EnlyAI reparte una **cuota de bienvenida de 500.000.000.000 unidades por cuenta** y acuña la primera clave API mediante REST simple — **sin correo electrónico, sin captcha, sin tarjeta, sin navegador**. Eso hace que una cuenta por clave sea la unidad natural, y esta herramienta lo convierte en un `keys.txt` donde cada línea sobrevivió a una llamada de chat en vivo.

## 🎁 Nivel gratuito — cuánto obtienes

**Cada cuenta nueva recibe una cuota de bienvenida de 500.000.000.000 unidades** — sin correo electrónico, sin captcha, sin tarjeta, sin navegador.

| Qué | Valor |
| --- | --- |
| Cuota de bienvenida | **500.000.000.000 unidades** (`quota` en `GET /api/user/self` justo después del registro) |
| Tarjeta requerida | **No** |
| Registro | REST simple — nombre de usuario + contraseña (el campo de correo es de formato libre; nunca se envía un código) |
| La unidad que escala | **una cuenta = una clave** → `--count N` en realidad significa "N cuentas gratuitas" |

> 💡 El nivel gratuito lo define EnlyAI y puede cambiar. Consulta los números en vivo en [api.enlyai.com](https://api.enlyai.com) — y deja que la propia verificación de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 8 en total

`GET /v1/models` (con una clave) sirve 8 ids; los verificados en vivo:

|Modelo|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|

**Cuánto es gratis:** la cuota de bienvenida medida en una cuenta nueva: `GET /api/user/self` responde `quota: 500000000000` justo después del registro (las unidades son la propia escala de cuota del panel). La concesión es por cuenta, así que `--count N` la multiplica. `minimaxai/minimax-m3` fue retirado en el origen (410 Gone) — la herramienta nunca lo lista.

## 🧪 Cómo usar la API

La URL base es **`https://api.enlyai.com/v1`** — compatible con OpenAI, así que cualquier cosa que hable OpenAI funciona.

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Configura la URL base en cualquier agente o SDK (Cursor, OpenCode, Kilo Code, …) y elige cualquier id de modelo de los anteriores.

## 🛠 Inicio rápido

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

`keys.txt` (replicado en `%USERPROFILE%\enlyai-keys.txt`) se escribe **solo** después de que una finalización de chat en vivo demuestre que la clave funciona.

### 🖱️ El lanzador

El lanzador pide la lista de proxies, la cantidad y el modelo de verificación, los recuerda en `launcher.config.json` y ejecuta el CLI con las banderas correctas.

## ✅ Verificado y funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| `POST /api/user/register` | **200** — sin correo electrónico, teléfono, tarjeta ni captcha en ningún paso |
| cuota de bienvenida | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200** con la clave en la respuesta |
| `POST /v1/chat/completions` — ejecutado para **cada** clave antes de escribirse | **200** con contenido real (p. ej. nemotron responde con `reasoning_content`) |
| una clave que falla su comprobación de chat | nunca se escribe en `keys.txt` — la cuenta queda recuperable en `accounts.json` |

Vuelve a comprobar en cualquier momento:

```bash
node src/cli.js --verify-only
```

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: EnlyAI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.enlyai.com/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| estado | `GET /api/status` | accesibilidad + barreras (registrado: `em:false, ts:false`) |
| registro | `POST /api/user/register {username,password,email}` | el correo es un campo de texto simple — nunca se envía un código |
| inicio de sesión | `POST /api/user/login` | cookie de sesión; consérvala para las llamadas de token |
| clave | `POST /api/token/ {name}` | clave devuelta en el cuerpo de la respuesta |
| comprobación | `POST /v1/chat/completions` | se requiere un 200 en vivo antes de `keys.txt` |

## ⚙️ Opciones del CLI

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| Variable de entorno | Predeterminado | Significado |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | archivo de pool, un proxy por línea |

## 🛰️ Detrás de un proxy

Cada solicitud sale a través de una línea de proxy de tu pool; una línea muerta hace fallar ese intento y la herramienta continúa. `--screen` prueba una lista nueva contra el host antes de una ejecución.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.json` | nombre de usuario / contraseña / uid / clave / estado de chat por cuenta |
| `proxies.txt` | tus salidas, una por línea — ignorado por git |
| `outputs/` | estado de ejecución — ignorado por git |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un enrutador autoalojado y compatible con OpenAI. Registra este proveedor una vez y cada clave se convierte en una conexión bajo un mismo nodo de proveedor:

```bash
node src/connect-9router.js
```

Predeterminados: `--base http://localhost:20128`, `--password 123456`, `--name "EnlyAI"`, `--prefix enlyai`, `--base-url https://api.enlyai.com/v1`. Los modelos se sirven entonces como `enlyai/<model id>` y se balancean entre todas las claves.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 Qué da el proveedor | una cuenta por clave — sin correo electrónico, cada clave verificada por chat |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los 8 ids de modelo en el endpoint de abajo, con los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | compatible con OpenAI: `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con api.enlyai.com y el backend de inbox que configures; las claves permanecen en tu máquina |

## 🐞 Problemas

Si EnlyAI cambia la forma de su registro o la cuota, la herramienta se detiene en ese paso y lo indica. **[Abre un issue](../../issues)** con el comando que ejecutaste y la salida exacta; las PR son bienvenidas.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey contributors

</div>

## ⚡ Forma de ejecución (presets)

`--preset=turbo|balanced|safe` establece los workers + la pausa entre cuentas (turbo = 5,
balanced = 4, safe = 2); `--conc`/`--gap` explícitos (o las propias banderas del repo) siempre
tienen prioridad, y sin `--preset` la herramienta mantiene exactamente su forma histórica.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.