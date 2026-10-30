// A single naming system for homepage selections and full catalogs.
export const catalog = {
  reaction: { title: "反應力測試", label: "反應 · 5 回合", icon: "ϟ" },
  memory: { title: "記憶翻牌", label: "記憶 · 6 組配對", icon: "▦" },
  aim: { title: "浮標點擊挑戰", label: "速度 · 30 秒", icon: "◎" },
  guessing: { title: "海底數字寶藏", label: "推理 · 7 次機會", icon: "?" },
  wheel: { title: "海洋羅盤", label: "日常 · 隨機選擇", icon: "◉" },
  text: { title: "文字整理", label: "文字 · 空白與重複行", icon: "Aa" },
  json: { title: "JSON 整理", label: "開發 · 格式與語法", icon: "{ }" },
  timestamp: { title: "時間戳轉換", label: "開發 · 秒與毫秒", icon: "00:00" },
  diff: { title: "文字差異比較", label: "開發 · 逐行比較", icon: "±" },
  url: { title: "URL 編解碼", label: "開發 · 參數處理", icon: "%" },
  uuid: { title: "UUID 產生器", label: "開發 · UUID v4", icon: "#" },
  color: { title: "配色對比檢查", label: "設計 · 純色對比", icon: "Aa" },
};

export function refineCards() {
  document.querySelectorAll('.card[data-open]').forEach(card => {
    const item = catalog[card.dataset.open];
    if (!item) return;
    const heading = card.querySelector('h3');
    heading.replaceChildren(document.createTextNode(item.title + ' '));
    const arrow = document.createElement('span');
    arrow.textContent = '↗'; arrow.setAttribute('aria-hidden','true'); heading.append(arrow);
    const meta = card.querySelector('.eyebrow'); if (meta) meta.textContent = item.label;
    card.querySelectorAll('.new-tag,.pill,.cover-tag').forEach(el => el.remove());
    card.querySelector('.cover')?.setAttribute('aria-hidden','true');
    card.setAttribute('aria-label', item.title + '：' + (card.querySelector('.card-body p')?.textContent || ''));
  });
}
