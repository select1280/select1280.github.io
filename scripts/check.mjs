import fs from "node:fs";
import path from "node:path";
import { root } from "./build.mjs";
const dist = path.join(root, "dist");
let pages = 0,
  modules = 0;
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
}
for (const file of walk(dist)) {
  const content = fs.readFileSync(file, "utf8");
  if (file.endsWith(".html")) {
    pages++;
    if (content.includes("<!-- NAV -->")) throw Error("未填入共用導覽");
    for (const [, link] of content.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      if (/^(https?:|mailto:|data:)/.test(link)) continue;
      const name = link.split(/[?#]/)[0];
      if (name && !fs.existsSync(path.resolve(path.dirname(file), name)))
        throw Error("連結不存在：" + link + " in " + file);
    }
  }
  if (file.endsWith(".js")) {
    modules++;
    for (const [, link] of content.matchAll(
      /(?:from\s*|import\s*)['"]([^'"]+)['"]/g,
    )) {
      if (
        link.startsWith(".") &&
        !fs.existsSync(path.resolve(path.dirname(file), link))
      )
        throw Error("模組不存在：" + link);
    }
  }
}
for (const [name, amount] of [
  ["games", 4],
  ["tools", 8],
]) {
  const html = fs.readFileSync(path.join(dist, name + ".html"), "utf8");
  if ([...html.matchAll(/class="card"/g)].length !== amount)
    throw Error("卡片數量錯誤");
}
console.log(
  `檢查通過：${pages} 份 HTML、${modules} 個模組、站內連結與 4／8 功能目錄。`,
);
