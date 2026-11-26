import { config } from "./config.ts";

const API = `https://api.telegram.org/bot${config.telegramToken}`;

export type TgMessage = {
  message_id: number;
  from?: { id: number; first_name?: string };
  chat: { id: number };
  text?: string;
};

export type TgUpdate = {
  update_id: number;
  message?: TgMessage;
};

// Telegram'dan yeni mesajları bekler (uzun yoklama: sunucu 30 sn'ye kadar bekler).
export async function getUpdates(offset: number): Promise<TgUpdate[]> {
  const res = await fetch(`${API}/getUpdates?timeout=30&offset=${offset}`);
  if (!res.ok) throw new Error(`getUpdates ${res.status}`);
  const body = (await res.json()) as { ok: boolean; result?: TgUpdate[] };
  return body.result ?? [];
}

// Telegram mesaj sınırı 4096 karakter; uzun cevapları parçalara böl.
export async function sendMessage(chatId: number, text: string): Promise<void> {
  const chunks = splitText(text, 4000);
  for (const chunk of chunks) {
    const res = await fetch(`${API}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: chunk }),
    });
    if (!res.ok) {
      console.error("sendMessage hata:", res.status, await res.text());
    }
  }
}

function splitText(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const out: string[] = [];
  let rest = text;
  while (rest.length > max) {
    let cut = rest.lastIndexOf("\n", max);
    if (cut < max * 0.5) cut = max;
    out.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) out.push(rest);
  return out;
}
