import assert from "node:assert/strict";
globalThis.matchMedia = () => ({ matches: false });
const tools = await import("../src/features/tools/developer.js");
const journal = await import("../src/features/journal/notes.js");
assert.equal(tools.formatJSON('{"a":1}', true), '{"a":1}');
assert.throws(() => tools.formatJSON("{invalid}"));
assert.equal(
  tools.parseTimestamp("0", "seconds").toISOString(),
  "1970-01-01T00:00:00.000Z",
);
assert.equal(
  tools.parseTimestamp("1700000000", "seconds").getTime(),
  1700000000000,
);
assert.equal(
  tools.parseTimestamp("1700000000000", "milliseconds").getTime(),
  1700000000000,
);
assert.throws(() => tools.parseTimestamp("", "seconds"));
assert.throws(() => tools.parseTimestamp("not a number", "seconds"));
assert.equal(journal.taipeiDay(new Date("2026-10-29T15:59:59Z")), "2026-10-29");
assert.equal(journal.taipeiDay(new Date("2026-10-29T16:00:00Z")), "2026-10-30");
assert.equal(journal.noteIndex("2026-10-29"), journal.noteIndex("2026-10-29"));
// Every day in one cycle gets a different message, including month boundaries.
const dailyIndices = Array.from({length:30},(_,i)=>journal.noteIndex(
  new Date(Date.UTC(2026,9,20+i)).toISOString().slice(0,10)
));
assert.equal(new Set(dailyIndices).size,30);
assert.equal(journal.notes.length,30);
assert.equal(new Set(journal.notes.map(n=>n.id)).size,30);
for (const [before, after] of [
  ["a\nb", "a\nc"],
  ["", "new"],
  ["same", "same"],
  ["a\na\nb", "a\nb\na"],
  ["<script>", "&hello"],
  ["a\n", "\na"],
]) {
  const rows = tools.diffLines(before, after);
  assert.equal(
    rows
      .filter((r) => r.type !== "added")
      .map((r) => r.value)
      .join("\n"),
    before,
  );
  assert.equal(
    rows
      .filter((r) => r.type !== "removed")
      .map((r) => r.value)
      .join("\n"),
    after,
  );
}
assert.throws(() => tools.diffLines("a\n".repeat(301), "b"));
console.log(
  "通過：JSON、無效輸入、秒／毫秒、台北日期跨日、漂流瓶選擇、差異重建與行數限制。",
);
