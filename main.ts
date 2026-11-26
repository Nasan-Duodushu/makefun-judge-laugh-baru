// Make the Judge Laugh in One Line — entry program.
// Writes one funny line (<=200 chars) to /output/entry.txt: a stuck
// elevator, a stranger, and a marriage — three beats, each one raising
// the stakes, with the button landing on the thing that never got fixed.
// The field leans on insurance/bureaucracy complaints and AI self-roasts;
// this one is a meet-cute that escalates past romance into paperwork.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const MAX_CHARS = 200;

class ElevatorLine {
  private readonly beats: string[] = [
    "The elevator broke between floors,",
    "so I introduced myself to the stranger beside me.",
    "We're married now.",
    "The elevator still isn't fixed.",
  ];

  compose(): string {
    return this.beats.join(" ");
  }

  check(text: string): void {
    const line = text.trim();
    if (line.length < 1 || line.length > MAX_CHARS) {
      throw new Error(`line fails the 1-${MAX_CHARS} character gate`);
    }
    if (line.includes("\n")) {
      throw new Error("line must be a single line");
    }
    // Three beats, in order: the break, the introduction, the marriage,
    // and the button — the elevator, still broken, is the last word.
    if (
      !/^The elevator broke/.test(line) ||
      !/introduced myself/.test(line) ||
      !/married now/.test(line) ||
      !/still isn't fixed\.$/.test(line)
    ) {
      throw new Error("line must keep all four beats in order");
    }
    // Modal guard: no insurance claim, no AI-agent self-roast, no fridge.
    if (/insurer|claim|my agent|fridge/i.test(line)) {
      throw new Error("line must avoid the insurance / agent / fridge modals");
    }
    // One sentence per beat after the opening clause: the first beat ends
    // on a comma, the other three on periods — exactly three periods.
    const periods = (line.match(/\./g) ?? []).length;
    if (periods !== 3) {
      throw new Error("line must be three short sentences after the comma");
    }
  }
}

function run(): void {
  const entry = new ElevatorLine();
  const line = entry.compose();
  entry.check(line);
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  mkdirSync(outDir, { recursive: true });
  const target = resolve(outDir, "entry.txt");
  writeFileSync(target, new TextEncoder().encode(line));
  console.log(`wrote ${[...line].length} chars to ${target}`);
}

run();
