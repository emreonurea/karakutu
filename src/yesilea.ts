import { config } from "./config.ts";

// Yeşilea web sitesi ayakta mı diye bakar.
export async function checkYesilea(): Promise<string> {
  try {
    const res = await fetch(config.yesileaUrl, { method: "GET" });
    if (res.ok) {
      return `✅ Yeşilea ayakta görünüyor (durum ${res.status}).\n${config.yesileaUrl}`;
    }
    return `⚠️ Yeşilea beklenmedik bir yanıt verdi (durum ${res.status}).`;
  } catch {
    return "❌ Yeşilea'ya ulaşamadım. Site şu an açılmıyor olabilir.";
  }
}
