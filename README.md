# Karakutu 🖤

Emre'nin kişisel **Telegram botu**. Günlük işlerde yardımcı olur ve Yeşilea uygulaması için fikir kutusu olarak çalışır.

Kendi başına çalışır (bir kez kurunca ben kapansam da ayakta kalır). İstersen yapay zeka beyni (Claude) bağlanır ve serbestçe Türkçe sohbet eder.

## Ne yapar
- **Sohbet:** Normal yazarsın, cevap verir (yapay zeka beyni açıksa).
- **/fikir <metin>** — Yeşilea için aklına geleni kaydeder.
- **/fikirler** — kayıtlı fikirleri listeler.
- **/tamam <no>** — bir fikri "yapıldı" işaretler.
- **/sil <no>** — fikri siler.
- **/durum** — Yeşilea web sitesi ayakta mı diye bakar.
- **/yardim** — komut listesi.

## Kurulum (adım adım)

**1. Telegram bot anahtarı al (bedava):**
Telegram'da `@BotFather`'a yaz, `/newbot` de, bota bir isim ver. Sana uzun bir anahtar verir (token). Bunu bir yere kopyala.

**2. Kendi numaranı öğren (önerilir):**
Telegram'da `@userinfobot`'a yaz. Sana bir numara (ID) verir. Bu sayede botu sadece sen kullanabilirsin.

**3. Ayar dosyasını hazırla:**
```bash
cp .env.example .env
```
`.env` dosyasını aç, anahtarları yapıştır:
- `TELEGRAM_BOT_TOKEN=` → BotFather'ın verdiği anahtar
- `TELEGRAM_OWNER_ID=` → kendi numaran
- `ANTHROPIC_API_KEY=` → (opsiyonel) yapay zeka beyni için anahtar. Boş bırakırsan bot sadece komutlarla çalışır.

**4. Çalıştır:**
```bash
npm install
npm start
```
Artık Telegram'da botuna yazabilirsin.

## Notlar
- `.env` dosyası ve `data/` klasörü **asla GitHub'a gönderilmez** (içinde anahtarlar ve kişisel veriler var).
- Yapay zeka beyni kullandıkça ücretlenir (her mesaj birkaç kuruş). Daha ucuzu için `.env` içinde `KARAKUTU_MODEL=claude-haiku-5-5` yazabilirsin.
- Botun 7/24 açık kalması için bir sunucuda çalışması gerekir. Bedava ve ücretli seçenekleri sonra konuşacağız.
