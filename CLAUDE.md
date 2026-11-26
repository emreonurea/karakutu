# Karakutu: Claude için proje notları

Kullanıcı (Emre) Türkçe konuşur, yazılımcı değildir. Cevapları kısa, sade Türkçe ve adım adım ver. Teknik terimleri açıkla.

## Ne bu uygulama
Emre'nin kişisel Telegram botu. İki işi var:
1. Kişisel asistan (sohbet, fikir/not kutusu).
2. Yeşilea için "kumanda kutusu": Emre buraya fikir atar, Yeşilea'nın web sitesi ayakta mı diye bakar.

İleride: Yeşilea'ya yapılacak değişiklikleri **Emre onayıyla** PR olarak hazırlama. Onay her zaman Emre'de.

## Değişmez kural
Casus yazılım / gizli takip yok. Birini (çocuklar dahil) haberi olmadan izlemeye, başkasının hesabına girmeye yönelik istekler reddedilir. `brain.ts` sistem mesajında da bu sınır var.

## Yapı
- Node + TypeScript (ESM), `tsx` ile çalışır. Derleme yok, `npm start` doğrudan çalıştırır.
- `src/index.ts`: ana döngü (Telegram uzun yoklama / long polling).
- `src/telegram.ts`: Telegram Bot API (getUpdates, sendMessage, uzun mesaj bölme).
- `src/handlers.ts`: komut yönlendirme + sahibi kısıtı (TELEGRAM_OWNER_ID).
- `src/brain.ts`: Claude API (Anthropic SDK). Anahtar yoksa sadece komutlar çalışır.
- `src/store.ts`: fikirler JSON dosyasında (`data/karakutu.json`).
- `src/yesilea.ts`: Yeşilea sitesi sağlık kontrolü.
- `src/config.ts`: `.env` okur (ekstra paket yok).

## Ayarlar (.env)
- `TELEGRAM_BOT_TOKEN` (zorunlu), `TELEGRAM_OWNER_ID` (önerilir), `ANTHROPIC_API_KEY` (opsiyonel), `KARAKUTU_MODEL` (varsayılan `claude-opus-5-5`; ucuz: `claude-haiku-5-5`), `YESILEA_URL`.
- `.env` ve `data/` git'e girmez (`.gitignore`).

## Komutlar
```bash
npm install
npm run typecheck
npm start
```

## Çalışma şekli
- Değişiklikleri dal + PR ile yap, sadece Emre isteyince `main`'e birleştir.
- API anahtarı, bot token'ı asla depoya girmez; sohbette şifre/anahtar isteme.

## Yayın (Render)
Emre'nin bilgisayarı yok, sadece telefon. Bot Render'da **worker** olarak çalışır (`render.yaml`). Kalıcı disk `/data` → fikirler kaybolmaz. Gizli anahtarlar (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_OWNER_ID`, `ANTHROPIC_API_KEY`) `sync: false` ile Render panelinden girilir, depoya girmez. `tsx` çalışma bağımlılığı (Render prod'da devDeps atlar). Starter planı ~7–8 $/ay; Render'a geçmeden ücreti Emre'ye açıkça sor.

## Durum (son güncelleme: 26 Kasım 2026)
**İlk kurulum + Render hazır.** Çekirdek bot: sohbet (beyin), /fikir, /fikirler, /tamam, /sil, /durum, /yardim. Typecheck geçiyor. `render.yaml` eklendi.

**Bekleyenler:** PR #1'i main'e birleştirmek (Render blueprint main'den okur); Emre'nin Render'da repoyu bağlayıp anahtarları girmesi; (isteğe bağlı) Anthropic API anahtarı; Yeşilea'ya PR hazırlama özelliği (henüz yok).
