import { $, store, lifecycle } from "../../shared/core.js";
export const notes = [
  {
    id: "small-start",
    title: "從小問題開始",
    body: "不需要先做一個完整系統。先找到一件每天重複的小事，做一個能省下幾個步驟的工具，再從實際使用中調整。",
    link: "tools.html",
    label: "打開工具箱",
  },
  {
    id: "random-wheel",
    title: "公平抽選，也要看得懂",
    body: "羅盤先用隨機數決定結果，再計算停止角度。固定指針與盤面結果一致，才不會讓動畫說一件事、文字說另一件事。",
    link: "tools.html",
    label: "試試海洋羅盤",
  },
  {
    id: "less-motion",
    title: "動畫也需要休息",
    body: "有些人會在裝置上開啟「減少動態效果」。網站尊重這個設定，保留內容和操作，減少不必要的移動。",
    link: "about.html",
    label: "關於這個網站",
  },
  {
    id: "local-record",
    title: "本機紀錄不是全站統計",
    body: "localStorage 的紀錄屬於此瀏覽器。清除網站資料或換裝置後不會保留，因此不能把它當作全站訪客人數。",
    link: "about.html",
    label: "查看探索航誌",
  },
  {
    id: "native-modules",
    title: "沒有框架，也可以有結構",
    body: "原生 JavaScript 可以透過 ES Modules 拆分功能。共用儲存、遊戲、工具和互動效果各有職責，不必全部放在同一支程式。",
    link: "journal.html#native",
    label: "閱讀航行日誌",
  },
  {
    id: "static-pages",
    title: "靜態網站也能互動",
    body: "靜態指的是主機提供檔案的方式。遊戲、文字處理和圖表互動仍可在瀏覽器執行；跨訪客儲存資料才需要另外的服務。",
    link: "journal.html#static",
    label: "了解網站的起點",
  },
];
export function taipeiDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export function noteIndex(day) {
  return (
    Array.from(day).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0) %
    notes.length
  );
}
export function bottle() {
  lifecycle.cleanup = () => {};
  const day = taipeiDay(),
    note = notes[noteIndex(day)],
    saved = store.get("saved-notes", []);
  $("#content").innerHTML =
    '<span class="eyebrow">今日漂流瓶 · 台北時間</span><h3 id="bottle-title"></h3><p id="bottle-copy"></p><div class="actions"><button class="primary" id="save-note"></button><a class="secondary" id="bottle-link"></a></div><p class="hint">每日輪換一則，共 6 則；收藏僅存於此瀏覽器。</p>';
  $("#bottle-title").textContent = note.title;
  $("#bottle-copy").textContent = note.body;
  $("#bottle-link").href = note.link;
  $("#bottle-link").textContent = note.label + " →";
  const button = $("#save-note");
  button.textContent = saved.includes(note.id) ? "已收藏" : "收藏這則筆記";
  button.onclick = () => {
    const ids = store.get("saved-notes", []);
    if (!ids.includes(note.id)) ids.push(note.id);
    store.set("saved-notes", ids);
    button.textContent = "已收藏";
  };
}
export function renderSavedNotes() {
  const target = $("#saved-notes");
  if (!target) return;
  const saved = store.get("saved-notes", []);
  const matches = notes.filter((n) => saved.includes(n.id));
  if (!matches.length) {
    target.textContent = "尚未收藏。到首頁打開今日漂流瓶，可以收藏喜歡的筆記。";
    return;
  }
  target.replaceChildren();
  for (const note of matches) {
    const article = document.createElement("article"),
      h = document.createElement("h3"),
      p = document.createElement("p");
    h.textContent = note.title;
    p.textContent = note.body;
    article.append(h, p);
    target.append(article);
  }
}
