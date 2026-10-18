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

**Créez en masse des comptes EnlyAI avec des clés API générées automatiquement — inférence compatible OpenAI + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Niveau gratuit](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-8-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ Pourquoi cet outil existe

EnlyAI offre un **quota de bienvenue de 500 000 000 000 unités par compte** et génère la première clé API via du REST simple — **sans e-mail, sans captcha, sans carte, sans navigateur**. Cela fait d'un compte par clé l'unité naturelle, et cet outil transforme cela en un `keys.txt` où chaque ligne a survécu à un appel de chat en direct.

## 🎁 Niveau gratuit — ce que vous obtenez

**Chaque nouveau compte reçoit un quota de bienvenue de 500 000 000 000 unités** — sans e-mail, sans captcha, sans carte, sans navigateur.

| Quoi | Valeur |
| --- | --- |
| Quota de bienvenue | **500 000 000 000 unités** (`quota` sur `GET /api/user/self` juste après l'inscription) |
| Carte requise | **Non** |
| Inscription | REST simple — nom d'utilisateur + mot de passe (le champ e-mail est libre ; aucun code n'est jamais envoyé) |
| L'unité qui se multiplie | **un compte = une clé** → `--count N` signifie en réalité « N comptes gratuits » |

> 💡 Le niveau gratuit est défini par EnlyAI et peut changer. Consultez les chiffres en direct sur [api.enlyai.com](https://api.enlyai.com) — et laissez le contrôle de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 8 au complet

`GET /v1/models` (avec une clé) sert 8 identifiants ; ceux vérifiés en direct :

|Modèle|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|

**Combien est gratuit :** le quota de bienvenue mesuré sur un compte neuf : `GET /api/user/self` répond `quota: 500000000000` juste après l'inscription (les unités suivent l'échelle de quota propre au panneau). L'attribution est par compte, donc `--count N` la multiplie. `minimaxai/minimax-m3` a été retiré en amont (410 Gone) — l'outil ne le liste jamais.

## 🧪 Comment utiliser l'API

L'URL de base est **`https://api.enlyai.com/v1`** — compatible OpenAI, donc tout ce qui parle OpenAI fonctionne.

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Définissez l'URL de base dans n'importe quel agent ou SDK (Cursor, OpenCode, Kilo Code, …) et choisissez n'importe quel identifiant de modèle ci-dessus.

## 🛠 Démarrage rapide

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

`keys.txt` (dupliqué vers `%USERPROFILE%\enlyai-keys.txt`) n'est écrit **qu'**après qu'une complétion de chat en direct a prouvé la clé.

### 🖱️ Le lanceur

Le lanceur demande la liste de proxies, le nombre et le modèle de vérification, les mémorise dans `launcher.config.json`, et exécute le CLI avec les bons drapeaux.

## ✅ Vérifié fonctionnel — chaque clé est testée

| Vérification | Résultat |
| --- | --- |
| `POST /api/user/register` | **200** — aucun e-mail, téléphone, carte ou captcha à aucune étape |
| quota de bienvenue | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200** avec la clé dans la réponse |
| `POST /v1/chat/completions` — exécuté pour **chaque** clé avant son écriture | **200** avec du contenu réel (par ex. nemotron répond avec `reasoning_content`) |
| une clé qui échoue à sa vérification de chat | jamais écrite dans `keys.txt` — le compte reste récupérable dans `accounts.json` |

Revérifiez à tout moment :

```bash
node src/cli.js --verify-only
```

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: EnlyAI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.enlyai.com/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Remarques |
| --- | --- | --- |
| statut | `GET /api/status` | accessibilité + barrières (enregistré : `em:false, ts:false`) |
| inscription | `POST /api/user/register {username,password,email}` | l'e-mail est un simple champ texte — aucun code n'est jamais envoyé |
| connexion | `POST /api/user/login` | cookie de session ; conservez-le pour les appels de jeton |
| clé | `POST /api/token/ {name}` | clé renvoyée dans le corps de la réponse |
| vérification | `POST /v1/chat/completions` | un 200 en direct requis avant `keys.txt` |

## ⚙️ Options du CLI

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| Variable d'environnement | Défaut | Signification |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | fichier de pool, un proxy par ligne |

## 🛰️ Derrière un proxy

Chaque requête sort via une ligne de proxy de votre pool ; une ligne morte fait échouer cette tentative et l'outil passe à la suivante. `--screen` teste une nouvelle liste contre l'hôte avant une exécution.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.json` | nom d'utilisateur / mot de passe / uid / clé / statut de chat par compte |
| `proxies.txt` | vos sorties, une par ligne — ignoré par git |
| `outputs/` | état d'exécution — ignoré par git |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI. Enregistrez ce fournisseur une fois et chaque clé devient une connexion sous un même nœud-fournisseur :

```bash
node src/connect-9router.js
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--name "EnlyAI"`, `--prefix enlyai`, `--base-url https://api.enlyai.com/v1`. Les modèles sont alors servis sous `enlyai/<model id>` et répartis en charge entre toutes les clés.

## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 Ce que le fournisseur donne | un compte par clé — sans e-mail, chaque clé vérifiée par chat |
| 🔑 Ce qu'une clé vous apporte | une clé API limitée à son propre compte : les 8 identifiants de modèle sur le point de terminaison ci-dessous, aux limites de votre forfait. Le quota réside sur le **compte**, ce qui explique précisément pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 Vos données | seuls api.enlyai.com et le backend de boîte de réception que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Si EnlyAI modifie la forme de son inscription ou son quota, l'outil s'arrête à cette étape et le signale. **[Ouvrez un ticket](../../issues)** avec la commande que vous avez exécutée et la sortie exacte ; les PR sont bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey contributors

</div>

## ⚡ Forme d'exécution (préréglages)

`--preset=turbo|balanced|safe` définit les workers + la pause entre les comptes (turbo = 5,
balanced = 4, safe = 2) ; les `--conc`/`--gap` explicites (ou les drapeaux propres au dépôt) l'emportent toujours,
et sans `--preset` l'outil conserve exactement sa forme historique.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.