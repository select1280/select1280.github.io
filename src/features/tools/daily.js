import {
  $,
  store,
  count,
  lifecycle,
  toast,
  motionOK,
} from "../../shared/core.js";
export function wheelTarget(index, total) {
  return (360 - ((index + 0.5) * 360) / total) % 360;
}
export function wheel() {
  let timer,
    rotation = 0,
    busy = false;
  lifecycle.cleanup = () => clearTimeout(timer);
  $("#content").innerHTML =
    '<p>輸入選項，轉動海洋羅盤。固定指針指向的扇區，就是你的結果。</p><label for="options">每行一個選項（2–50 個不同選項）</label><textarea id="options" rows="4" maxlength="5000"></textarea><div class="compass-wrap"><span class="fixed-needle" aria-hidden="true"></span><svg class="compass-disc" viewBox="0 0 300 300" role="img" aria-label="選項轉盤"></svg><span class="compass-hub" aria-hidden="true">✦</span></div><p class="result" aria-live="polite">讓指針帶你選個方向。</p><button id="spin" class="primary">轉動羅盤</button><details class="wheel-legend"><summary>查看完整選項</summary><ol></ol></details><p class="hint">每個扇區機率相同，重複文字自動合併。指針固定在上方，盤面停止位置與抽選結果一致。</p>';
  const input = $("#options"),
    disc = $(".compass-disc");
  input.value = store.get(
    "options",
    "拉麵\n咖哩\n水餃\n便當\n義大利麵\n自己煮",
  );
  const options = () => [
    ...new Set(
      input.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
  const svgNS = "http://www.w3.org/2000/svg";
  function draw() {
    const list = options();
    disc.replaceChildren();
    $(".wheel-legend ol").replaceChildren();
    rotation = 0;
    disc.style.transition = "none";
    disc.style.transform = "rotate(0deg)";
    if (list.length < 2 || list.length > 50) {
      $(".result").textContent = "請輸入 2 到 50 個不同選項";
      return;
    }
    const colors = [
      "#b8eafa",
      "#a4d8ec",
      "#c4f0e9",
      "#d1e7ff",
      "#a8e2e2",
      "#e1f4fc",
    ];
    const step = 360 / list.length;
    for (let i = 0; i < list.length; i++) {
      const rad = (a) => ((a - 90) * Math.PI) / 180;
      const a = i * step,
        b = (i + 1) * step;
      const point = (t) => [
        150 + 142 * Math.cos(rad(t)),
        150 + 142 * Math.sin(rad(t)),
      ];
      const p = point(a),
        q = point(b);
      let sector = document.createElementNS(svgNS, "path");
      sector.setAttribute(
        "d",
        `M150 150 L${p.join(" ")} A142 142 0 ${step > 180 ? 1 : 0} 1 ${q.join(" ")} Z`,
      );
      sector.setAttribute("fill", colors[i % colors.length]);
      sector.setAttribute("stroke", "#ffffff");
      sector.setAttribute("stroke-width", "1.5");
      disc.append(sector);
      const mid = (a + b) / 2;
      const tx = 150 + 99 * Math.cos(rad(mid)),
        ty = 150 + 99 * Math.sin(rad(mid));
      const label = document.createElementNS(svgNS, "text");
      label.setAttribute("x", String(tx));
      label.setAttribute("y", String(ty));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("dominant-baseline", "middle");
      label.setAttribute(
        "font-size",
        list.length > 20 ? "8" : list.length > 12 ? "10" : "12",
      );
      label.setAttribute("fill", "#164c68");
      label.setAttribute("transform", `rotate(${mid},${tx},${ty})`);
      label.textContent =
        list.length > 12
          ? String(i + 1)
          : Array.from(list[i]).slice(0, 6).join("") +
            (Array.from(list[i]).length > 6 ? "…" : "");
      disc.append(label);
      let li = document.createElement("li");
      li.textContent = list[i];
      $(".wheel-legend ol").append(li);
    }
  }
  input.oninput = () => {
    if (!busy) {
      draw();
      $(".result").textContent = "讓指針帶你選個方向。";
    }
  };
  draw();
  $("#spin").onclick = () => {
    const list = options();
    if (list.length < 2 || list.length > 50) {
      toast("請輸入 2 到 50 個不同選項");
      return;
    }
    busy = true;
    store.set("options", input.value);
    $("#spin").disabled = input.disabled = true;
    const random = new Uint32Array(1),
      limit = Math.floor(4294967296 / list.length) * list.length;
    do {
      crypto.getRandomValues(random);
    } while (random[0] >= limit);
    const pick = random[0] % list.length,
      target = wheelTarget(pick, list.length);
    rotation += 1800 + ((target - (rotation % 360) + 360) % 360);
    disc.style.transition = motionOK
      ? "transform 3.6s cubic-bezier(.12,.7,.14,1)"
      : "none";
    void disc.getBoundingClientRect();
    disc.style.transform = `rotate(${rotation}deg)`;
    $(".result").textContent = "航向選擇中…";
    timer = setTimeout(
      () => {
        $(".result").textContent = `指針選中了：${list[pick]}`;
        busy = false;
        $("#spin").disabled = input.disabled = false;
        count("tools");
      },
      motionOK ? 3700 : 0,
    );
  };
}
export function text() {
  lifecycle.cleanup = () => {};
  $("#content").innerHTML =
    '<p>文字只在你的瀏覽器中處理，不會上傳。每次整理都可以復原。</p><label for="text-input">貼上文字</label><textarea id="text-input" rows="8" placeholder="把需要整理的文字放在這裡…"></textarea><p class="text-count"></p><div class="actions"><button class="secondary" data-transform="trim">修剪每行空白</button><button class="secondary" data-transform="blank">移除空白行</button><button class="secondary" data-transform="duplicate">刪除重複行</button><button class="secondary" data-transform="space">合併連續空格</button></div><div class="actions"><button class="primary" id="copy">複製結果</button><button class="secondary" id="undo" disabled>復原</button><button class="secondary" id="clear">清空</button></div>';
  let history = [];
  const input = $("#text-input");
  function update() {
    $(".text-count").textContent =
      Array.from(input.value).length +
      " 字元（含空白） · " +
      (input.value ? input.value.split("\n").length : 0) +
      " 行";
    $("#undo").disabled = !history.length;
  }
  function save() {
    history.push(input.value);
    if (history.length > 30) history.shift();
  }
  input.oninput = update;
  document.querySelectorAll("[data-transform]").forEach(
    (b) =>
      (b.onclick = () => {
        if (!input.value) {
          toast("請先輸入文字");
          return;
        }
        save();
        let lines = input.value.split("\n");
        input.value = {
          trim: () => lines.map((x) => x.trim()).join("\n"),
          blank: () => lines.filter((x) => x.trim()).join("\n"),
          duplicate: () => [...new Set(lines)].join("\n"),
          space: () => input.value.replace(/[\t ]+/g, " "),
        }[b.dataset.transform]();
        count("tools");
        update();
      }),
  );
  $("#undo").onclick = () => {
    if (history.length) input.value = history.pop();
    update();
  };
  $("#clear").onclick = () => {
    if (input.value) save();
    input.value = "";
    update();
  };
  $("#copy").onclick = async () => {
    try {
      await navigator.clipboard.writeText(input.value);
      toast("已複製文字");
    } catch {
      toast("無法存取剪貼簿，請選取文字後手動複製");
    }
  };
  update();
}
