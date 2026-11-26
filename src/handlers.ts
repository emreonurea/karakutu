import { config, hasBrain } from "./config.ts";
import { sendMessage, type TgMessage } from "./telegram.ts";
import { addIdea, listIdeas, removeIdea, markDone } from "./store.ts";
import { think, type Turn } from "./brain.ts";
import { checkYesilea } from "./yesilea.ts";

// Her sohbet için kısa hafıza (son birkaç mesaj).
const histories = new Map<number, Turn[]>();

const HELP = `Merhaba, ben Karakutu 🖤

Yapabildiklerim:
• Normal yaz, sohbet edelim (yapay zeka beyni açıksa).
• /fikir <metin> — Yeşilea için bir fikir kaydet
• /fikirler — kayıtlı fikirleri göster
• /tamam <no> — bir fikri "yapıldı" olarak işaretle
• /sil <no> — bir fikri sil
• /durum — Yeşilea ayakta mı diye bak
• /yardim — bu mesaj`;

export async function handle(msg: TgMessage): Promise<void> {
  const chatId = msg.chat.id;
  const fromId = msg.from?.id ?? 0;
  const text = (msg.text ?? "").trim();

  // Sadece sahibi kullanabilsin (TELEGRAM_OWNER_ID tanımlıysa).
  if (config.ownerId && fromId !== config.ownerId) {
    await sendMessage(chatId, "Bu özel bir bot, erişimin yok.");
    return;
  }
  if (!text) return;

  if (text === "/start" || text === "/yardim" || text === "/help") {
    await sendMessage(chatId, HELP);
    return;
  }

  if (text === "/durum") {
    await sendMessage(chatId, await checkYesilea());
    return;
  }

  if (text.startsWith("/fikir")) {
    const body = text.slice("/fikir".length).trim();
    if (!body) {
      await sendMessage(chatId, "Kullanım: /fikir market listesine adet yazsın");
      return;
    }
    const idea = addIdea(body);
    await sendMessage(chatId, `Kaydettim (#${idea.id}): ${idea.text}`);
    return;
  }

  if (text === "/fikirler") {
    const ideas = listIdeas();
    if (ideas.length === 0) {
      await sendMessage(chatId, "Henüz fikir yok. /fikir ile ekleyebilirsin.");
      return;
    }
    const lines = ideas.map((i) => `${i.done ? "✅" : "•"} #${i.id} ${i.text}`);
    await sendMessage(chatId, "Fikirler:\n" + lines.join("\n"));
    return;
  }

  if (text.startsWith("/sil")) {
    const id = Number(text.slice("/sil".length).trim());
    if (!id) {
      await sendMessage(chatId, "Kullanım: /sil 3");
      return;
    }
    await sendMessage(chatId, removeIdea(id) ? `#${id} silindi.` : `#${id} bulunamadı.`);
    return;
  }

  if (text.startsWith("/tamam")) {
    const id = Number(text.slice("/tamam".length).trim());
    if (!id) {
      await sendMessage(chatId, "Kullanım: /tamam 3");
      return;
    }
    await sendMessage(chatId, markDone(id) ? `#${id} yapıldı olarak işaretlendi.` : `#${id} bulunamadı.`);
    return;
  }

  if (text.startsWith("/")) {
    await sendMessage(chatId, "Bu komutu bilmiyorum. /yardim yaz.");
    return;
  }

  // Serbest sohbet -> yapay zeka beyni
  if (!hasBrain()) {
    await sendMessage(chatId, "Yapay zeka beynim henüz bağlı değil. Komutları kullanabilirsin: /yardim");
    return;
  }

  const history = histories.get(chatId) ?? [];
  history.push({ role: "user", content: text });
  try {
    const reply = await think(history);
    history.push({ role: "assistant", content: reply });
    while (history.length > 12) history.shift(); // son ~6 soru-cevabı tut
    histories.set(chatId, history);
    await sendMessage(chatId, reply);
  } catch (err) {
    console.error("beyin hatası:", err);
    history.pop(); // başarısız soruyu hafızadan çıkar
    await sendMessage(chatId, "Bir hata oldu, birazdan tekrar dener misin?");
  }
}
