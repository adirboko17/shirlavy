import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ABOUT_HEADING,
  ABOUT_PARAGRAPHS,
  ABOUT_SECTION_SLICES,
  ABOUT_STORY_ORDER,
} from "../lib/about-narrative";

function parseCanonicalFile(raw: string): { heading: string; paragraphs: string[] } {
  const lines = raw.trim().split("\n");
  const heading = lines[0];
  const paragraphs: string[] = [];
  let cur: string[] = [];
  for (const line of lines.slice(1)) {
    if (line === "") {
      if (cur.length) {
        paragraphs.push(cur.join("\n"));
        cur = [];
      }
    } else {
      cur.push(line);
    }
  }
  if (cur.length) paragraphs.push(cur.join("\n"));
  return { heading, paragraphs };
}

function flattenSectionOrder(): number[] {
  const order: number[] = [...ABOUT_SECTION_SLICES.intro];
  for (const chapter of ABOUT_SECTION_SLICES.chapters) order.push(...chapter);
  order.push(...ABOUT_SECTION_SLICES.quote, ...ABOUT_SECTION_SLICES.closing);
  return order;
}

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function main() {
  const errors: string[] = [];

  const canonPath = join(__dirname, "../content/shir/about-canonical-20261108.txt");
  let canon: { heading: string; paragraphs: string[] };
  try {
    canon = parseCanonicalFile(readFileSync(canonPath, "utf8"));
  } catch {
    canon = parseCanonicalFile(
      readFileSync(
        "/home/ubuntu/.cursor/projects/workspace/uploads/about-verbatim-20261108_0db1.txt",
        "utf8",
      ),
    );
  }

  if (ABOUT_HEADING !== canon.heading) {
    errors.push("ABOUT_HEADING does not match canonical source");
  }

  if (ABOUT_PARAGRAPHS.length !== canon.paragraphs.length) {
    errors.push(`Expected ${canon.paragraphs.length} paragraphs, got ${ABOUT_PARAGRAPHS.length}`);
  }

  const n = Math.min(ABOUT_PARAGRAPHS.length, canon.paragraphs.length);
  for (let i = 0; i < n; i++) {
    if (ABOUT_PARAGRAPHS[i] !== canon.paragraphs[i]) {
      errors.push(`Paragraph ${i} mismatch with canonical source`);
    }
  }

  const flat = flattenSectionOrder();
  if (flat.join(",") !== ABOUT_STORY_ORDER.join(",")) {
    errors.push("ABOUT_STORY_ORDER does not match section layout");
  }

  const seen = new Set(flat);
  if (seen.size !== flat.length) {
    errors.push("Duplicate paragraph indices in about layout");
  }

  if (flat.length !== ABOUT_PARAGRAPHS.length) {
    errors.push("Layout does not include every narrative paragraph exactly once");
  }

  for (let i = 0; i < flat.length; i++) {
    if (flat[i] !== i) {
      errors.push(`Paragraphs are not rendered in canonical order (index ${i})`);
      break;
    }
  }

  const rendered = flat.map((idx) => ABOUT_PARAGRAPHS[idx]);
  const assembled = [...rendered].join("\n\n");
  const expected = canon.paragraphs.join("\n\n");
  if (normalizeWhitespace(assembled) !== normalizeWhitespace(expected)) {
    errors.push("Assembled story text does not match canonical paragraphs");
  }

  if (errors.length) {
    console.error("About narrative verification failed:\n- " + errors.join("\n- "));
    process.exit(1);
  }

  console.log(`OK: ${ABOUT_PARAGRAPHS.length} verbatim paragraphs in order`);
}

main();
