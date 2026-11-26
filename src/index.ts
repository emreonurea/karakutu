import { config, hasBrain } from "./config.ts";
import { getUpdates } from "./telegram.ts";
import { handle } from "./handlers.ts";

async function main(): Promise<void> {
  if (!config.telegramToken) {
    console.error("TELEGRAM_BOT_TOKEN tanımlı değil. .env dosyasına ekle (örnek: .env.example).");
    process.exit(1);
  }

  console.log(
    "Karakutu çalışıyor." +
      (hasBrain() ? " (yapay zeka beyni açık)" : " (beyin kapalı — sadece komutlar)"),
  );

  let offset = 0;
  // Hatalara dayanıklı sonsuz dinleme döngüsü.
  for (;;) {
    try {
      const updates = await getUpdates(offset);
      for (const u of updates) {
        offset = u.update_id + 1;
        if (u.message) {
          try {
            await handle(u.message);
          } catch (err) {
            console.error("mesaj işleme hatası:", err);
          }
        }
      }
    } catch (err) {
      console.error("getUpdates hatası, 3 sn sonra tekrar denenecek:", err);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

void main();
