import { $, count, store, lifecycle } from "../../shared/core.js";
export function guessFeedback(value, answer) {
  if (!Number.isInteger(value) || value < 1 || value > 100)
    throw Error("請輸入 1～100 的整數");
  return value === answer ? "correct" : value < answer ? "higher" : "lower";
}
export function guessing() {
  let answer, attempts, done;
  $("#content").innerHTML =
    '<p>海底藏著一個 1～100 的整數。根據提示縮小範圍，在 7 次內找到它。</p><form id="guess-form"><label for="guess-input">你猜的數字</label><input id="guess-input" type="number" min="1" max="100" step="1" required><div class="actions"><button class="primary" type="submit">送出猜測</button><button class="secondary" type="button" id="guess-new">新的一局</button></div></form><p class="status" id="guess-status" aria-live="polite"></p><ol class="guess-history"></ol>';
  lifecycle.cleanup = () => {};
  function reset() {
    const bytes = new Uint32Array(1),
      limit = Math.floor(4294967296 / 100) * 100;
    do {
      crypto.getRandomValues(bytes);
    } while (bytes[0] >= limit);
    answer = (bytes[0] % 100) + 1;
    attempts = 0;
    done = false;
    $("#guess-input").disabled = false;
    $("#guess-form button[type=submit]").disabled = false;
    $("#guess-input").value = "";
    $(".guess-history").replaceChildren();
    $("#guess-status").textContent = "準備好了嗎？還有 7 次機會。";
  }
  reset();
  $("#guess-new").onclick = reset;
  $("#guess-form").onsubmit = (e) => {
    e.preventDefault();
    if (done) return;
    try {
      const value = Number($("#guess-input").value),
        feedback = guessFeedback(value, answer);
      if (attempts === 0) count("plays");
      attempts++;
      const li = document.createElement("li");
      li.textContent =
        value +
        " → " +
        { correct: "找到了！", higher: "答案更大", lower: "答案更小" }[
          feedback
        ];
      $(".guess-history").append(li);
      if (feedback === "correct") {
        done = true;
        count("finishes");
        $("#guess-status").textContent = "找到寶藏！用了 " + attempts + " 次。";
      } else if (attempts === 7) {
        done = true;
        $("#guess-status").textContent =
          "機會用完了，答案是 " + answer + "。換個策略再試一次！";
      } else
        $("#guess-status").textContent =
          (feedback === "higher" ? "往更大的數字找。" : "往更小的數字找。") +
          "還有 " +
          (7 - attempts) +
          " 次機會。";
      if (done) {
        $("#guess-input").disabled = true;
        $("#guess-form button[type=submit]").disabled = true;
      } else {
        $("#guess-input").value = "";
        $("#guess-input").focus();
      }
    } catch (error) {
      $("#guess-status").textContent = error.message;
    }
  };
}
export function aim() {
  let clock = null,
    deadline = 0,
    hits = 0,
    misses = 0,
    running = false;
  $("#content").innerHTML =
    '<p>30 秒內點中浮標。每次命中會換位置；點空白處算未命中。鍵盤模式可用 Tab 選取浮標，再按 Enter／空白鍵。</p><div class="aim-summary"><span id="aim-time">30 秒</span><span id="aim-score">0 命中</span><span id="aim-best"></span></div><button class="primary" id="aim-start">開始挑戰</button><div class="aim-field"><button id="aim-target" class="aim-target" aria-label="點中浮標" hidden>◎</button><span class="aim-watermark" aria-hidden="true">FOLLOW THE BUOY</span></div><p class="status" id="aim-status" aria-live="polite">按開始後才計時。</p>';
  const field = $(".aim-field"),
    target = $("#aim-target");
  $("#aim-best").textContent = "本機最佳 " + store.get("aim-best") + " 命中";
  function stop() {
    clearInterval(clock);
    running = false;
    target.hidden = true;
    $("#aim-start").disabled = false;
    $("#aim-start").textContent = "再玩一次";
  }
  function onVisibility() {
    if (document.hidden && running) {
      stop();
      $("#aim-status").textContent = "挑戰已中斷，請重新開始。";
    }
  }
  document.addEventListener("visibilitychange", onVisibility);
  lifecycle.cleanup = () => {
    stop();
    document.removeEventListener("visibilitychange", onVisibility);
  };
  function move() {
    target.style.left = 5 + Math.random() * 75 + "%";
    target.style.top = 5 + Math.random() * 65 + "%";
  }
  function finish() {
    stop();
    count("finishes");
    store.set("aim-best", Math.max(hits, Number(store.get("aim-best"))));
    $("#aim-best").textContent = "本機最佳 " + store.get("aim-best") + " 命中";
    $("#aim-time").textContent = "0 秒";
    $("#aim-status").textContent =
      "完成！命中 " +
      hits +
      " 次，準確率 " +
      (hits + misses ? Math.round((hits / (hits + misses)) * 100) : 0) +
      "%。不同輸入方式的成績不宜直接比較。";
  }
  function active() {
    if (running && performance.now() >= deadline) {
      finish();
      return false;
    }
    return running;
  }
  $("#aim-start").onclick = () => {
    stop();
    hits = misses = 0;
    running = true;
    deadline = performance.now() + 30000;
    count("plays");
    $("#aim-start").disabled = true;
    target.hidden = false;
    $("#aim-score").textContent = "0 命中";
    $("#aim-time").textContent = "30 秒";
    $("#aim-status").textContent = "追著浮標走！";
    move();
    clock = setInterval(() => {
      if (active())
        $("#aim-time").textContent =
          Math.ceil((deadline - performance.now()) / 1000) + " 秒";
    }, 100);
  };
  target.onclick = (e) => {
    e.stopPropagation();
    if (!active()) return;
    hits++;
    $("#aim-score").textContent = hits + " 命中";
    move();
  };
  field.onclick = () => {
    if (active()) misses++;
  };
}
