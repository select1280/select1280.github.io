import { $, store } from "../../shared/core.js";
import { initAtlas } from './atlas.js';
initAtlas();
document.querySelectorAll("[data-layer]").forEach(
  (button) =>
    (button.onclick = () => {
      document.querySelectorAll("[data-layer]").forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      const labels = {
        surface: [
          "海面 · 好奇的起點",
          "先看見，再問為什麼。每一個問題都可以是新的航線。",
        ],
        middle: [
          "海中 · 動手探索",
          "把想法做成可以操作的作品，從回饋裡找到下一步。",
        ],
        deep: [
          "深海 · 未知的可能",
          "越往深處走，越知道還有更多可以學。保持好奇，繼續下潛。",
        ],
      };
      document.querySelector("#depth-title").textContent =
        labels[button.dataset.layer][0];
      document.querySelector("#depth-copy").textContent =
        labels[button.dataset.layer][1];
      document.querySelector(".depth-chart").dataset.depth =
        button.dataset.layer;
    }),
);
const chart = $(".local-chart");
if (chart) {
  const values = ["plays", "tools", "finishes"].map((k) =>
    Number(store.get(k)),
  );
  const max = Math.max(...values, 1);
  chart.querySelectorAll(".chart-bar").forEach((b, i) => {
    b.style.setProperty(
      "--value",
      Math.max(values[i] ? 3 : 0, (values[i] / max) * 100) + "%",
    );
    b.querySelector("strong").textContent = values[i].toLocaleString("zh-TW");
  });
  const best = store.get("reaction-best", null);
  $("#personal-best").textContent = best ? best + " ms" : "尚未挑戰";
}
