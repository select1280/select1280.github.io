import { $, renderCounts, lifecycle } from "./shared/core.js";
import { reaction, memory } from "./features/games/basic.js";
import { wheel, text } from "./features/tools/daily.js";
import {
  jsonTool,
  timestampTool,
  diffTool,
} from "./features/tools/developer.js";
import { aim, guessing } from "./features/games/challenges.js";
import { urlTool, uuidTool, colorTool } from "./features/tools/utilities.js";
import { bottle, renderSavedNotes } from "./features/journal/notes.js";
import "./features/ocean/effects.js";
import "./features/ocean/scene.js";
renderCounts();
$("#year").textContent = new Date().getFullYear();
document.querySelectorAll("[data-filter]").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll("[data-filter]")
        .forEach((x) => x.classList.toggle("active", x === b));
      document
        .querySelectorAll(".card")
        .forEach(
          (c) =>
            (c.hidden =
              b.dataset.filter !== "all" &&
              c.dataset.category !== b.dataset.filter),
        );
    }),
);
const titles = {
  reaction: "ϟ 反應力測試",
  memory: "✿ 記憶翻牌",
  wheel: "◉ 海洋羅盤",
  text: "Aa 文字整理",
  json: "JSON 整理與檢查",
  timestamp: "時間戳轉換",
  diff: "文字差異比較",
  bottle: "今日漂流瓶",
  aim: "浮標點擊挑戰",
  guessing: "海底數字寶藏",
  url: "URL 編解碼",
  uuid: "UUID 產生器",
  color: "配色對比檢查",
};
document.querySelectorAll("[data-open]").forEach(
  (b) =>
    (b.onclick = () => {
      lifecycle.cleanup();
      $("#modal-title").textContent = titles[b.dataset.open];
      $("#modal").showModal();
      ({
        reaction,
        memory,
        wheel,
        text,
        json: jsonTool,
        timestamp: timestampTool,
        diff: diffTool,
        bottle,
        aim,
        guessing,
        url: urlTool,
        uuid: uuidTool,
        color: colorTool,
      })[b.dataset.open]();
    }),
);
$("#close").onclick = () => $("#modal").close();
$("#modal").addEventListener("close", () => lifecycle.cleanup());

addEventListener("pagehide", () => lifecycle.cleanup());
renderSavedNotes();
$("#modal").addEventListener("close", renderSavedNotes);

document.querySelectorAll("[data-group]").forEach(
  (button) =>
    (button.onclick = () => {
      const group = button.dataset.group;
      document.querySelectorAll("[data-group]").forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      const cards = [...document.querySelectorAll(".catalog-grid .card")];
      cards.forEach(
        (card) =>
          (card.hidden = group !== "all" && card.dataset.kind !== group),
      );
      const summary = document.querySelector(".catalog-summary");
      if (summary)
        summary.textContent =
          "顯示 " +
          cards.filter((card) => !card.hidden).length +
          " / " +
          cards.length +
          " 項";
    }),
);
