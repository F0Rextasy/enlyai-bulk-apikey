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

**Otomatik oluşturulan API anahtarlarıyla toplu EnlyAI hesabı açın — OpenAI uyumlu çıkarım + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-8%20served-412991?style=for-the-badge)](https://api.enlyai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-8-of-them) · [🧪 API'yi kullanın](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

EnlyAI, **hesap başına 500.000.000.000 birimlik bir hoş geldin kotası** veriyor ve ilk API anahtarını düz REST üzerinden oluşturuyor — **e-posta yok, captcha yok, kart yok, tarayıcı yok**. Bu da anahtar başına bir hesabı doğal birim hâline getiriyor; bu araç da bunu, her satırı canlı bir sohbet çağrısından geçmiş bir `keys.txt` dosyasına dönüştürüyor.

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

**Her yeni hesap 500.000.000.000 birimlik bir hoş geldin kotası alır** — e-posta yok, captcha yok, kart yok, tarayıcı yok.

| Ne | Değer |
| --- | --- |
| Hoş geldin kotası | **500.000.000.000 birim** (kayıttan hemen sonra `GET /api/user/self` yanıtındaki `quota`) |
| Kart gerekli mi | **Hayır** |
| Kayıt | düz REST — kullanıcı adı + parola (e-posta alanı serbest metindir; hiçbir kod gönderilmez) |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` aslında "N ücretsiz hesap" demektir |

> 💡 Ücretsiz katman EnlyAI tarafından belirlenir ve değişebilir. Güncel rakamları [api.enlyai.com](https://api.enlyai.com) adresinden kontrol edin — ve aracın kendi denetiminin karar vermesine izin verin:

```bash
node src/cli.js --verify-only     # keys.txt içindeki her anahtar gerçek bir sohbet çağrısıyla yeniden test edilir
```

## 🤖 Modeller — 8'inin tamamı

`GET /v1/models` (bir anahtarla) 8 kimlik sunar; canlı olarak doğrulananlar:

|Model|✓|
|---|---|
|`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`|✓|
|`enlyai-work`|✓|
|`google/diffusiongemma-26b-a4b-it`|✓|
|`meta/llama-3.2-11b-vision-instruct`|✓|
|`meta/muse-glimmer-30b`|✓|
|`nvidia/nemotron-3-super-120b-a12b`|✓|
|`nvidia/nemotron-3.5-lightning-30b-a3b`|✓|

**Ne kadarı ücretsiz:** yeni bir hesapta ölçülen hoş geldin kotası: kayıttan hemen sonra `GET /api/user/self` yanıtı `quota: 500000000000` döner (birimler panelin kendi kota ölçeğidir). Bu hak hesap başına verilir, dolayısıyla `--count N` bunu çarpar. `minimaxai/minimax-m3` üst akışta kullanımdan kaldırıldı (410 Gone) — araç bu modeli hiçbir zaman listelemez.

## 🧪 API nasıl kullanılır

Temel URL **`https://api.enlyai.com/v1`** — OpenAI uyumlu, yani OpenAI konuşan her şey çalışır.

```bash
curl https://api.enlyai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Herhangi bir ajan veya SDK'da (Cursor, OpenCode, Kilo Code, …) temel URL'yi ayarlayın ve yukarıdaki model kimliklerinden birini seçin.

## 🛠 Hızlı başlangıç

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

`keys.txt` (`%USERPROFILE%\enlyai-keys.txt` dosyasına da yansıtılır) **yalnızca** canlı bir sohbet tamamlama çağrısı anahtarı kanıtladıktan sonra yazılır.

### 🖱️ Başlatıcı

Başlatıcı proxy listesini, sayıyı ve doğrulama modelini sorar, bunları `launcher.config.json` içinde hatırlar ve CLI'yi doğru bayraklarla çalıştırır.

## ✅ Doğrulandı — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| `POST /api/user/register` | **200** — hiçbir adımda e-posta, telefon, kart veya captcha yok |
| hoş geldin kotası | `GET /api/user/self` → `quota: 500000000000` |
| `POST /api/token/` | **200**, anahtar yanıt içinde |
| `POST /v1/chat/completions` — yazılmadan önce **her** anahtar için çalıştırılır | **200**, gerçek içerikle (örneğin nemotron `reasoning_content` ile yanıt verir) |
| sohbet kontrolünde başarısız olan anahtar | `keys.txt` dosyasına asla yazılmaz — hesap `accounts.json` içinde kurtarılabilir kalır |

İstediğiniz zaman yeniden kontrol edin:

```bash
node src/cli.js --verify-only
```

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: EnlyAI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.enlyai.com/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| durum | `GET /api/status` | erişilebilirlik + denetimler (kaydedilen: `em:false, ts:false`) |
| kayıt | `POST /api/user/register {username,password,email}` | e-posta düz bir metin alanıdır — hiçbir kod gönderilmez |
| oturum açma | `POST /api/user/login` | oturum çerezi; anahtar çağrıları için saklayın |
| anahtar | `POST /api/token/ {name}` | anahtar yanıt gövdesinde döner |
| kontrol | `POST /v1/chat/completions` | `keys.txt` öncesinde canlı 200 yanıtı gerekir |

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --screen         # only test the proxy list
node src/cli.js --help
```

| Ortam değişkeni | Varsayılan | Anlamı |
| --- | --- | --- |
| `ENLYAI_PROXIES` | `proxies.txt` | havuz dosyası, her satırda bir proxy |

## 🛰️ Proxy arkasında

Her istek, havuzunuzdaki bir proxy satırı üzerinden çıkar; ölü bir satır o denemeyi başarısız kılar ve araç devam eder. `--screen`, bir çalıştırmadan önce yeni bir listeyi ana makineye karşı test eder.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.json` | hesap başına kullanıcı adı / parola / uid / anahtar / sohbet durumu |
| `proxies.txt` | çıkışlarınız, satır başına bir tane — git tarafından yok sayılır |
| `outputs/` | çalıştırma durumu — git tarafından yok sayılır |

## 🔌 9Router'a bağlanın

[9Router](https://9router.com) kendi sunucunuzda barındırılan, OpenAI uyumlu bir yönlendiricidir. Bu sağlayıcıyı bir kez kaydedin ve her anahtar tek bir sağlayıcı düğümü altında bir bağlantı hâline gelsin:

```bash
node src/connect-9router.js
```

Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--name "EnlyAI"`, `--prefix enlyai`, `--base-url https://api.enlyai.com/v1`. Modeller ardından `enlyai/<model id>` olarak sunulur ve tüm anahtarlar arasında yük dengelenir.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **EnlyAI** — [api.enlyai.com](https://api.enlyai.com) |
| 🎁 Sağlayıcının verdikleri | anahtar başına bir hesap — e-posta gerektirmez, her anahtar sohbetle doğrulanır |
| 🔑 Bir anahtarın size kazandırdığı | kendi hesabına bağlı bir API anahtarı: aşağıdaki uç noktadaki 8 model kimliği, planınızın limitleri dahilinde. Kota **hesapta** yaşar; bu aracın anahtar başına bir hesap oluşturmasının nedeni de tam olarak budur |
| 🌐 API biçimi | OpenAI uyumlu: `POST https://api.enlyai.com/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca api.enlyai.com ve yapılandırdığınız gelen kutusu arka ucuyla iletişim kurulur; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

EnlyAI kayıt biçimini veya kotasını değiştirirse, araç o adımda durur ve bunu bildirir. Çalıştırdığınız komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**; PR'lar memnuniyetle karşılanır.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 enlyai-bulk-apikey katkıda bulunanlar

</div>

## ⚡ Çalıştırma biçimi (ön ayarlar)

`--preset=turbo|balanced|safe` worker sayısını + hesaplar arasındaki beklemeyi belirler (turbo = 5,
balanced = 4, safe = 2); açıkça verilen `--conc`/`--gap` (veya deponun kendi bayrakları) her zaman
önceliklidir ve `--preset` verilmezse araç geçmişteki biçimini aynen korur.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.