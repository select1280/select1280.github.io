import assert from "node:assert/strict";
import fs from "node:fs";
globalThis.matchMedia = () => ({ matches: false });
const t = await import("../src/features/tools/utilities.js"),
  g = await import("../src/features/games/challenges.js");
assert.equal(
  t.urlTransform(t.urlTransform("海洋 & a=b+c"), true),
  "海洋 & a=b+c",
);
assert.throws(() => t.urlTransform("%E0%A4", true));
assert.equal(t.urlTransform("a+b", true), "a+b");
assert.equal(t.contrastRatio("#000000", "#ffffff"), 21);
assert.equal(t.contrastRatio("#123456", "#123456"), 1);
assert.throws(() => t.contrastRatio("red", "#ffffff"));
assert.equal(g.guessFeedback(40, 50), "higher");
assert.equal(g.guessFeedback(60, 50), "lower");
assert.equal(g.guessFeedback(50, 50), "correct");
assert.throws(() => g.guessFeedback(1.5, 50));
assert.throws(() => g.guessFeedback(101, 50));

console.log("通過：URL、對比計算、猜謎提示與輸入限制");
