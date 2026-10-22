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

**Crie contas EnlyAI em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-8-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

A EnlyAI concede uma **cota de boas-vindas de 500.000.000.000 unidades por conta** e gera a primeira chave de API via REST puro — **sem e-mail, sem captcha, sem cartão, sem navegador**. Isso faz de uma conta por chave a unidade natural, e esta ferramenta transforma isso em um `keys.txt` onde cada linha sobreviveu a uma chamada de chat ao vivo.

## 🎁 Plano gratuito — quanto você recebe

**Toda nova conta recebe uma cota de boas-vindas de 500.000.000.000 unidades** — sem e-mail, sem captcha, sem cartão, sem navegador.

| O que | Valor |
| --- | --- |
| Cota de boas-vindas | **500.000.000.000 unidades** (`quota` em `GET /api/user/self` logo após o cadastro) |
| Cartão exigido | **Não** |
| Cadastro | REST puro — nome de usuário + senha (o campo de e-mail é livre; nenhum código é enviado) |
| A unidade que escala | **uma conta = uma chave** → `--count N` na verdade significa "N contas gratuitas" |

> 💡 O plano gratuito é definido pela EnlyAI e pode mudar. Confira os números ao vivo em [api.enlyai.com](https://api.enlyai.com) — e deixe o próprio gate da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 8

`GET /v1/models` (com uma chave) serve 8 ids; os verificados ao vivo:

|Modelo|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|
|`enlyai-work`|✓|
|`google/diffusiongemma-26b-a4b-it`|✓|
|`meta/llama-3.2-11b-vision-instruct`|✓|
|`meta/muse-glimmer-30b`|✓|
|`nvidia/nemotron-3-super-120b-a12b`|✓|
|`nvidia/nemotron-3.5-lightning-30b-a3b`|✓|

**Quanto é grátis:** a cota de boas-vindas medida em uma conta nova: `GET /api/user/self` responde `quota: 500000000000` logo após o cadastro (as unidades são a própria escala de cota do painel). A concessão é por conta, então `--count N` a multiplica. `minimaxai/minimax-m3` foi retirado upstream (410 Gone) — a ferramenta nunca o lista.

## 🧪 Como usar a API

A URL base é **`https://api.enlyai.com/v1`** — compatível com OpenAI, então qualquer coisa que fale OpenAI funciona.

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Defina a URL base em qualquer agente ou SDK (Cursor, OpenCode, Kilo Code, …) e escolha qualquer id de modelo acima.

## 🛠 Início rápido

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

`keys.txt` (espelhado em `%USERPROFILE%\enlyai-keys.txt`) é gravado **somente** depois que uma conclusão de chat ao vivo comprova a chave.

### 🖱️ O launcher

O launcher solicita a lista de proxies, a contagem e o modelo de verificação, lembra deles em `launcher.config.json` e executa a CLI com as flags corretas.

## ✅ Verificado funcionando — toda chave é testada

| Verificação | Resultado |
| --- | --- |
| `POST /api/user/register` | **200** — sem e-mail, telefone, cartão ou captcha em nenhuma etapa |
| cota de boas-vindas | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200** com a chave na resposta |
| `POST /v1/chat/completions` — executado para **toda** chave antes de ser gravada | **200** com conteúdo real (por exemplo, nemotron responde com `reasoning_content`) |
| uma chave que falha na verificação de chat | nunca é gravada em `keys.txt` — a conta permanece recuperável em `accounts.json` |

Verifique novamente a qualquer momento:

```bash
node src/cli.js --verify-only
```

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: EnlyAI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.enlyai.com/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Notas |
| --- | --- | --- |
| status | `GET /api/status` | alcançabilidade + gates (registrado: `em:false, ts:false`) |
| cadastro | `POST /api/user/register {username,password,email}` | o e-mail é um campo de string simples — nenhum código é enviado |
| login | `POST /api/user/login` | cookie de sessão; mantenha-o para as chamadas de token |
| chave | `POST /api/token/ {name}` | chave retornada no corpo da resposta |
| verificação | `POST /v1/chat/completions` | 200 ao vivo exigido antes de `keys.txt` |

## ⚙️ Opções da CLI

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| Variável de ambiente | Padrão | Significado |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | arquivo de pool, um proxy por linha |

## 🛰️ Atrás de um proxy

Cada requisição sai por uma linha de proxy do seu pool; uma linha morta faz essa tentativa falhar e a ferramenta segue em frente. `--screen` testa uma lista nova contra o host antes de uma execução.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada ao vivo por linha — ignorado pelo git |
| `accounts.json` | nome de usuário / senha / uid / chave / status de chat por conta |
| `proxies.txt` | suas saídas, uma por linha — ignorado pelo git |
| `outputs/` | estado da execução — ignorado pelo git |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI. Registre este provedor uma vez e cada chave se torna uma conexão sob um único provider-node:

```bash
node src/connect-9router.js
```

Padrões: `--base http://localhost:20128`, `--password 123456`, `--name "EnlyAI"`, `--prefix enlyai`, `--base-url https://api.enlyai.com/v1`. Os modelos são então servidos como `enlyai/<model id>` e balanceados entre todas as chaves.

## 🔑 O que uma chave oferece

| | |
| --- | --- |
| 🏢 Provedor | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 O que o provedor oferece | uma conta por chave — sem e-mail, toda chave verificada por chat |
| 🔑 O que uma chave oferece | uma chave de API limitada à sua própria conta: os 8 ids de modelo no endpoint abaixo, nos limites do seu plano. A cota fica na **conta**, que é exatamente por isso que esta ferramenta cria uma conta por chave |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 Seus dados | somente api.enlyai.com e o backend de caixa de entrada que você configurar são contatados; as chaves permanecem na sua máquina |

## 🐞 Problemas

Se a EnlyAI mudar o formato do cadastro ou a cota, a ferramenta para nessa etapa e avisa. **[Abra uma issue](../../issues)** com o comando que você executou e a saída exata; PRs são bem-vindos.

## 📄 Licença

MIT © 2026 — consulte [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 colaboradores do enlyai-bulk-apikey

</div>

## ⚡ Formato de execução (presets)

`--preset=turbo|balanced|safe` define workers + a pausa entre contas (turbo = 5,
balanced = 4, safe = 2); `--conc`/`--gap` explícitos (ou as flags do próprio repositório) sempre têm prioridade,
e, sem `--preset`, a ferramenta mantém exatamente seu formato histórico.

Turbo é recomendado (5 workers); mais do que isso traz risco de carga/ban em computadores fracos.