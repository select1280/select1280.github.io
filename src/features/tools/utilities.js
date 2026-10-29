import { $, count, lifecycle, toast } from "../../shared/core.js";
export function urlTransform(value, decode = false) {
  return decode ? decodeURIComponent(value) : encodeURIComponent(value);
}
export function contrastRatio(foreground, background) {
  function luminance(hex) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) throw Error("請輸入 #RRGGBB 格式");
    const channels = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }
  const a = luminance(foreground),
    b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
function begin(html) {
  lifecycle.cleanup = () => {};
  $("#content").innerHTML =
    '<p class="hint">資料僅在瀏覽器中處理，不會上傳。</p>' + html;
}
async function copy(value) {
  try {
    await navigator.clipboard.writeText(value);
    toast("已複製");
  } catch {
    toast("請選取結果後手動複製");
  }
}
export function urlTool() {
  begin(
    '<label for="url-input">文字或已編碼的內容</label><textarea id="url-input" rows="5" maxlength="100000" placeholder="例如：海洋 & learning"></textarea><div class="actions"><button class="primary" id="url-encode">編碼</button><button class="secondary" id="url-decode">解碼</button><button class="secondary" id="url-copy">複製結果</button></div><label for="url-output">結果</label><textarea id="url-output" rows="5" readonly></textarea><p id="url-status" role="status"></p><p class="hint">使用 encodeURIComponent／decodeURIComponent，適合單一參數值。不是整條網址編碼；不會把 + 自動當成空白。</p>',
  );
  function run(decode) {
    try {
      $("#url-output").value = urlTransform($("#url-input").value, decode);
      $("#url-status").textContent = "已" + (decode ? "解碼" : "編碼");
      count("tools");
    } catch {
      $("#url-output").value = "";
      $("#url-status").textContent =
        "無法解碼，請確認 % 後的編碼是否完整有效。";
    }
  }
  $("#url-encode").onclick = () => run(false);
  $("#url-decode").onclick = () => run(true);
  $("#url-copy").onclick = () => copy($("#url-output").value);
}
export function uuidTool() {
  begin(
    '<p>產生 UUID v4，適合測試資料或識別碼。不要將識別碼當成密碼或授權機制。</p><label for="uuid-amount">產生數量（1～100）</label><input id="uuid-amount" type="number" min="1" max="100" value="5"><div class="actions"><button class="primary" id="uuid-generate">產生 UUID</button><button class="secondary" id="uuid-copy">全部複製</button></div><textarea id="uuid-output" rows="7" readonly aria-label="UUID 結果"></textarea><p id="uuid-status" role="status"></p>',
  );
  $("#uuid-generate").onclick = () => {
    const amount = Number($("#uuid-amount").value);
    if (!Number.isInteger(amount) || amount < 1 || amount > 100) {
      $("#uuid-status").textContent = "請輸入 1～100 的整數";
      return;
    }
    if (!crypto.randomUUID) {
      $("#uuid-status").textContent =
        "此瀏覽器不支援安全 UUID 產生，請使用較新的瀏覽器及 HTTPS／localhost。";
      return;
    }
    $("#uuid-output").value = Array.from({ length: amount }, () =>
      crypto.randomUUID(),
    ).join("\n");
    $("#uuid-status").textContent = "已產生 " + amount + " 組 UUID v4";
    count("tools");
  };
  $("#uuid-copy").onclick = () => copy($("#uuid-output").value);
}
export function colorTool() {
  begin(
    '<div class="color-fields"><div><label for="foreground">文字色（#RRGGBB）</label><input id="foreground" value="#123E60" maxlength="7" spellcheck="false"></div><div><label for="background">背景色（#RRGGBB）</label><input id="background" value="#F6FCFF" maxlength="7" spellcheck="false"></div></div><button class="primary" id="contrast-check">檢查對比</button><div id="contrast-preview" class="contrast-preview"><strong>海洋裡，還有更多發現。</strong><p>Learning has no shoreline.</p></div><p id="contrast-result" role="status"></p><p class="hint">依 WCAG 2.x 的 sRGB 對比計算：AA 一般文字 4.5:1、大字 3:1；AAA 一般文字 7:1。此工具只檢查兩個不透明純色，不代表整頁無障礙合規。</p>',
  );
  function check(track) {
    try {
      const fg = $("#foreground").value.trim(),
        bg = $("#background").value.trim(),
        ratio = contrastRatio(fg, bg);
      $("#contrast-preview").style.color = fg;
      $("#contrast-preview").style.background = bg;
      $("#contrast-result").textContent =
        "對比 " +
        ratio.toFixed(2) +
        ":1 · AA 一般文字 " +
        (ratio >= 4.5 ? "通過" : "未通過") +
        " · AA 大字 " +
        (ratio >= 3 ? "通過" : "未通過") +
        " · AAA 一般文字 " +
        (ratio >= 7 ? "通過" : "未通過");
      if (track) count("tools");
    } catch (e) {
      $("#contrast-result").textContent = e.message;
    }
  }
  $("#contrast-check").onclick = () => check(true);
  check(false);
}
