import fs from "node:fs";
import path from "node:path";
import { config } from "./config.ts";

export type Idea = {
  id: number;
  text: string;
  createdAt: string;
  done: boolean;
};

type Data = {
  ideas: Idea[];
  nextId: number;
};

function load(): Data {
  try {
    const parsed = JSON.parse(fs.readFileSync(config.dataFile, "utf8")) as Partial<Data>;
    return { ideas: parsed.ideas ?? [], nextId: parsed.nextId ?? 1 };
  } catch {
    return { ideas: [], nextId: 1 };
  }
}

function save(data: Data): void {
  try {
    fs.mkdirSync(path.dirname(config.dataFile), { recursive: true });
    fs.writeFileSync(config.dataFile, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Veri kaydedilemedi:", err);
  }
}

export function addIdea(text: string): Idea {
  const data = load();
  const idea: Idea = {
    id: data.nextId,
    text,
    createdAt: new Date().toISOString(),
    done: false,
  };
  data.ideas.push(idea);
  data.nextId += 1;
  save(data);
  return idea;
}

export function listIdeas(): Idea[] {
  return load().ideas;
}

export function removeIdea(id: number): boolean {
  const data = load();
  const before = data.ideas.length;
  data.ideas = data.ideas.filter((i) => i.id !== id);
  if (data.ideas.length === before) return false;
  save(data);
  return true;
}

export function markDone(id: number): boolean {
  const data = load();
  const idea = data.ideas.find((i) => i.id === id);
  if (!idea) return false;
  idea.done = true;
  save(data);
  return true;
}
