import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");

// .env dosyasını basitçe yükle (ekstra paket gerektirmez).
try {
  const envPath = path.join(root, ".env");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  }
} catch {
  // .env yoksa sorun değil; ortam değişkenlerinden okunur.
}

export const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  anthropicKey: process.env.ANTHROPIC_API_KEY ?? "",
  ownerId: process.env.TELEGRAM_OWNER_ID ? Number(process.env.TELEGRAM_OWNER_ID) : 0,
  model: process.env.KARAKUTU_MODEL ?? "claude-opus-5-5",
  yesileaUrl: process.env.YESILEA_URL ?? "https://emreonurea.github.io/yesilea/",
  dataFile: process.env.KARAKUTU_DATA ?? path.join(root, "data", "karakutu.json"),
};

export function hasBrain(): boolean {
  return config.anthropicKey.length > 0;
}
