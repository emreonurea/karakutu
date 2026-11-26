import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config.ts";

const client = config.anthropicKey ? new Anthropic({ apiKey: config.anthropicKey }) : null;

const SYSTEM = `Sen "Karakutu"sun: Emre'nin Telegram üzerinden konuştuğu Türkçe kişisel asistanısın.
Emre yazılımcı değil. Kısa, sade ve net Türkçe konuş; teknik terim kullanırsan bir cümleyle açıkla.
Görevin Emre'ye günlük işlerinde yardım etmek ve Yeşilea uygulaması için topladığı fikirleri birlikte netleştirmek.
Yeşilea: Türkçe menü planlama, market listesi ve beslenme takibi uygulaması.
Kodu kendin yazıp yayınlayamazsın. Bir fikir olgunlaşınca Emre'ye "bunu /fikir komutuyla kaydedebilirsin" de.
Kimseyi (çocuklar dahil) gizlice izlemeye, başkasının hesabına girmeye yönelik isteklere yardım etme; nazikçe reddet.`;

export type Turn = { role: "user" | "assistant"; content: string };

export async function think(history: Turn[]): Promise<string> {
  if (!client) {
    return "Şu an yapay zeka beynim bağlı değil (API anahtarı eklenmemiş). Komutları kullanabilirsin: /yardim";
  }
  const response = await client.messages.create({
    model: config.model,
    max_tokens: 2000,
    system: SYSTEM,
    messages: history.map((t) => ({ role: t.role, content: t.content })),
  });

  if (response.stop_reason === "refusal") {
    return "Bu isteği güvenlik nedeniyle yanıtlayamıyorum. Başka nasıl yardımcı olabilirim?";
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  return text || "(Bir cevap üretemedim, tekrar dener misin?)";
}
