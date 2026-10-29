import { $, count, lifecycle, toast } from "../../shared/core.js";

export function formatJSON(value, compact = false) {
  return JSON.stringify(JSON.parse(value), null, compact ? 0 : 2);
}
export function parseTimestamp(value, unit) {
  const input = value.trim();
  if (!/^-?\d+(\.\d+)?$/.test(input)) throw Error("請輸入數字時間戳");
  const ms = Number(input) * (unit === "seconds" ? 1000 : 1);
  const date = new Date(ms);
  if (!Number.isFinite(ms) || Number.isNaN(date.getTime()))
    throw Error("時間戳超出有效日期範圍");
  return date;
}
export function diffLines(before, after) {
  const a = before.split("\n"),
    b = after.split("\n");
  if (a.length > 300 || b.length > 300) throw Error("每段最多比較 300 行");
  const table = Array.from(
    { length: a.length + 1 },
    () => new Uint16Array(b.length + 1),
  );
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      table[i][j] =
        a[i] === b[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
  let i = 0,
    j = 0,
    result = [];
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      result.push({ type: "same", value: a[i++] });
      j++;
    } else if (
      i < a.length &&
      (j === b.length || table[i + 1][j] >= table[i][j + 1])
    )
      result.push({ type: "removed", value: a[i++] });
    else result.push({ type: "added", value: b[j++] });
  }
  return result;
}
function begin(html) {
  lifecycle.cleanup = () => {};
  $("#content").innerHTML =
    '<p class="hint">資料僅在此瀏覽器處理，不會上傳；關閉視窗後不保留輸入。</p>' +
    html;
}
async function copy(value) {
  try {
    await navigator.clipboard.writeText(value);
    toast("已複製結果");
  } catch {
    toast("剪貼簿不可用，請選取文字手動複製");
  }
}
export function jsonTool() {
  begin(
    '<label for="json-input">JSON 內容</label><textarea id="json-input" rows="8" maxlength="200000" spellcheck="false" placeholder=\'{"hello":"ocean"}\'></textarea><div class="actions"><button class="primary" id="json-format">格式化</button><button class="secondary" id="json-minify">壓縮</button><button class="secondary" id="json-copy">複製結果</button></div><p id="json-status" role="status"></p><p class="hint">使用標準 JSON 解析器。大整數可能失去精度；格式化不保留原始數字字面值。</p>',
  );
  function run(compact) {
    try {
      const value = $("#json-input").value;
      if (!value.trim()) throw Error("請先輸入 JSON");
      const result = formatJSON(value, compact);
      $("#json-input").value = result;
      $("#json-status").textContent =
        "JSON 語法有效，已" + (compact ? "壓縮" : "格式化") + "。";
      count("tools");
    } catch (e) {
      $("#json-status").textContent = "無法解析：" + e.message;
    }
  }
  $("#json-format").onclick = () => run(false);
  $("#json-minify").onclick = () => run(true);
  $("#json-copy").onclick = () => copy($("#json-input").value);
}
export function timestampTool() {
  begin(
    '<label for="timestamp-input">Unix 時間戳</label><input id="timestamp-input" inputmode="decimal" placeholder="例如 1700000000"><label for="timestamp-unit">輸入單位</label><select id="timestamp-unit"><option value="seconds">秒</option><option value="milliseconds">毫秒</option></select><div class="actions"><button class="primary" id="time-convert">轉換日期</button><button class="secondary" id="time-now">帶入現在時間</button></div><pre class="tool-output" id="time-result" aria-live="polite">等待輸入</pre><label for="date-input">反向轉換：選擇台北時間（UTC+8）</label><input id="date-input" type="datetime-local" step="1"><button class="secondary" id="date-convert">轉成時間戳</button>',
  );
  function show(date) {
    $("#time-result").textContent =
      "UTC：" +
      date.toISOString() +
      "\n台北：" +
      new Intl.DateTimeFormat("zh-TW", {
        timeZone: "Asia/Taipei",
        dateStyle: "medium",
        timeStyle: "medium",
        hour12: false,
      }).format(date) +
      "\nUnix 秒：" +
      date.getTime() / 1000 +
      "\nUnix 毫秒：" +
      date.getTime();
  }
  $("#time-convert").onclick = () => {
    try {
      show(
        parseTimestamp($("#timestamp-input").value, $("#timestamp-unit").value),
      );
      count("tools");
    } catch (e) {
      $("#time-result").textContent = e.message;
    }
  };
  $("#time-now").onclick = () => {
    $("#timestamp-unit").value = "milliseconds";
    $("#timestamp-input").value = String(Date.now());
    $("#time-convert").click();
  };
  $("#date-convert").onclick = () => {
    const value = $("#date-input").value;
    if (!value) {
      $("#time-result").textContent = "請先選擇日期時間";
      return;
    }
    const date = new Date(value + "+08:00");
    if (Number.isNaN(date.getTime())) {
      $("#time-result").textContent = "無效日期";
      return;
    }
    show(date);
    count("tools");
  };
}
export function diffTool() {
  begin(
    '<div class="diff-inputs"><div><label for="diff-before">原始文字</label><textarea id="diff-before" rows="7" maxlength="30000"></textarea></div><div><label for="diff-after">修改後文字</label><textarea id="diff-after" rows="7" maxlength="30000"></textarea></div></div><div class="actions"><button class="primary" id="diff-run">比較差異</button></div><p id="diff-status" role="status"></p><div id="diff-output" class="diff-output"></div><p class="hint">逐行比較，最多各 300 行。紅色 − 表示刪除，綠色 + 表示新增；空白也是內容的一部分。</p>',
  );
  $("#diff-run").onclick = () => {
    try {
      const rows = diffLines($("#diff-before").value, $("#diff-after").value);
      $("#diff-output").replaceChildren();
      for (const row of rows) {
        let line = document.createElement("div");
        line.className = "diff-line " + row.type;
        line.textContent =
          (row.type === "added" ? "+ " : row.type === "removed" ? "− " : "  ") +
          row.value;
        $("#diff-output").append(line);
      }
      const added = rows.filter((x) => x.type === "added").length,
        removed = rows.filter((x) => x.type === "removed").length;
      $("#diff-status").textContent =
        added || removed
          ? `新增 ${added} 行，刪除 ${removed} 行。`
          : "兩段文字相同。";
      count("tools");
    } catch (e) {
      $("#diff-output").replaceChildren();
      $("#diff-status").textContent = e.message;
    }
  };
}
