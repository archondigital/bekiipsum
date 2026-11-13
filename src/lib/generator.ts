/**
 * Dummy-text generator. Pure functions, used at build time (the text shown before JS runs)
 * and in the browser. A dictionary comes from Payload → Dictionaries (or src/data/fallback.ts).
 * Output is safe for work unless Options.nsfw is set; then `nsfwWords` join the pool.
 */
import { esc } from "@corecastdigital/blocks/lexical";
export type Dictionary = {
  slug: string;
  name: string;
  description?: string | null;
  opening?: string | null;
  /** Safe-for-work vocabulary (the default). */
  words: string[];
  /** Vulgar words, mixed in only when Options.nsfw is on. */
  nsfwWords?: string[];
  connectors: string[];
  connectorRatio: number;
  isDefault?: boolean;
};

export type Mode = "paragraphs" | "sentences" | "words";

export type Options = {
  mode: Mode;
  count: number;
  /** Start the first paragraph with the dictionary's opening phrase ("Lorem ipsum keme keme"). */
  opening: boolean;
  /** Wrap paragraphs in <p> tags. */
  html: boolean;
  /** Mix the dictionary's NSFW words in with the safe ones. Off unless the visitor opts in. */
  nsfw?: boolean;
};

export const LIMITS: Record<Mode, { min: number; max: number; default: number }> = {
  paragraphs: { min: 1, max: 30, default: 4 },
  sentences: { min: 1, max: 100, default: 8 },
  words: { min: 1, max: 2000, default: 100 },
};

export const clampCount = (mode: Mode, n: unknown) => {
  const { min, max, default: d } = LIMITS[mode];
  const v = Math.round(Number(n));
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d;
};

/** mulberry32 — small seeded PRNG, so the build-time sample is stable between builds. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const int = (rnd: () => number, min: number, max: number) => min + Math.floor(rnd() * (max - min + 1));
const pick = <T>(rnd: () => number, a: T[]): T => a[Math.floor(rnd() * a.length)];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function makeTokens(d: Dictionary, rnd: () => number, n: number): string[] {
  const out: string[] = [];
  const ratio = d.connectors.length ? Math.min(0.8, Math.max(0, d.connectorRatio)) : 0;
  for (let i = 0; i < n; i++) {
    const edge = i === 0 || i === n - 1; // sentences never start or end on a connector
    const prev = out[out.length - 1];
    const prevIsConnector = prev !== undefined && d.connectors.includes(prev);
    const useConnector = !edge && !prevIsConnector && rnd() < ratio;
    let w = pick(rnd, useConnector ? d.connectors : d.words);
    for (let k = 0; k < 4 && w === prev; k++) w = pick(rnd, d.words); // no "keme keme" by accident
    out.push(w);
  }
  return out;
}

function sentence(d: Dictionary, rnd: () => number, len = int(rnd, 6, 14), lead?: string): string {
  const tokens = makeTokens(d, rnd, len);
  // a comma somewhere in the middle of longer sentences
  if (len >= 9 && rnd() < 0.55) {
    const at = int(rnd, 3, len - 4);
    tokens[at] += ",";
  }
  const end = rnd() < 0.1 ? "!" : rnd() < 0.06 ? "?" : ".";
  const body = (lead ? [lead, ...tokens] : tokens).join(" ");
  return cap(body) + end;
}

function paragraph(d: Dictionary, rnd: () => number, lead?: string): string {
  const n = int(rnd, 3, 6);
  return Array.from({ length: n }, (_, i) => sentence(d, rnd, undefined, i === 0 ? lead : undefined)).join(" ");
}

/** Returns paragraphs (plain strings). */
export function generate(dict: Dictionary, o: Options, rnd: () => number = Math.random): string[] {
  const d = o.nsfw && dict.nsfwWords?.length ? { ...dict, words: [...dict.words, ...dict.nsfwWords] } : dict;
  const count = clampCount(o.mode, o.count);
  const lead = o.opening && d.opening ? d.opening : undefined;

  if (o.mode === "paragraphs") {
    return Array.from({ length: count }, (_, i) => paragraph(d, rnd, i === 0 ? lead : undefined));
  }

  if (o.mode === "sentences") {
    const sentences = Array.from({ length: count }, (_, i) => sentence(d, rnd, undefined, i === 0 ? lead : undefined));
    // group into paragraphs of ~5 sentences so long outputs stay readable
    const paras: string[] = [];
    for (let i = 0; i < sentences.length; i += 5) paras.push(sentences.slice(i, i + 5).join(" "));
    return paras;
  }

  // words: exactly `count` words (the opening phrase counts toward it)
  const leadWords = lead ? lead.split(/\s+/) : [];
  const words: string[] = leadWords.slice(0, count);
  let remaining = count - words.length;
  const sentences: string[] = [];
  let first = words.length ? words.join(" ") : "";
  while (remaining > 0) {
    const len = Math.min(remaining, int(rnd, 6, 14));
    const tokens = makeTokens(d, rnd, len).flatMap((t) => t.split(/\s+/)).slice(0, len);
    remaining -= tokens.length;
    const body = first ? `${first} ${tokens.join(" ")}` : tokens.join(" ");
    first = "";
    sentences.push(cap(body) + ".");
  }
  if (first) sentences.push(cap(first) + ".");
  const paras: string[] = [];
  for (let i = 0; i < sentences.length; i += 6) paras.push(sentences.slice(i, i + 6).join(" "));
  return paras;
}

/** The text that goes on the clipboard. */
export const toText = (paras: string[], html: boolean) =>
  html ? paras.map((p) => `<p>${esc(p)}</p>`).join("\n") : paras.join("\n\n");

export const wordCount = (paras: string[]) => paras.join(" ").split(/\s+/).filter(Boolean).length;

/** Lines of a Payload textarea → list. */
export const lines = (v: unknown) =>
  String(v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
