"use strict";
const motionOK = !matchMedia("(prefers-reduced-motion: reduce)").matches;
if (motionOK) {
  const observer = new IntersectionObserver(
    (items) =>
      items.forEach((item) => {
        if (item.isIntersecting) {
          item.target.classList.add("in-view");
          observer.unobserve(item.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(
      ".section-title,.info-panel,.about-grid,.page-heading,.activity",
    )
    .forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  const art = document.querySelector(".kinetic");
  if (art && matchMedia("(pointer:fine)").matches) {
    art.addEventListener("pointermove", (e) => {
      const r = art.getBoundingClientRect();
      art.style.setProperty(
        "--mx",
        ((e.clientX - r.left) / r.width - 0.5) * 16 + "px",
      );
      art.style.setProperty(
        "--my",
        ((e.clientY - r.top) / r.height - 0.5) * 16 + "px",
      );
    });
    art.addEventListener("pointerleave", () => {
      art.style.setProperty("--mx", "0px");
      art.style.setProperty("--my", "0px");
    });
  }
  document.querySelectorAll("button,.profile-links a").forEach((el) =>
    el.addEventListener("click", (e) => {
      const r = el.getBoundingClientRect(),
        x = e.detail ? e.clientX : r.left + r.width / 2,
        y = e.detail ? e.clientY : r.top + r.height / 2;
      for (let i = 0; i < 7; i++) {
        const bit = document.createElement("span");
        bit.className = "click-spark";
        bit.style.left = x + "px";
        bit.style.top = y + "px";
        bit.style.setProperty(
          "--dx",
          Math.cos((i / 7) * Math.PI * 2) * 45 + "px",
        );
        bit.style.setProperty(
          "--dy",
          Math.sin((i / 7) * Math.PI * 2) * 45 + "px",
        );
        bit.style.background = ["#ff885b", "#53b5e8", "#a698ed", "#e9bd35"][
          i % 4
        ];
        document.body.append(bit);
        setTimeout(() => bit.remove(), 700);
      }
    }),
  );
}
const surprise = document.querySelector("#surprise");
if (surprise) {
  let n = 0;
  const phrases = [
    "想法，正在發芽。",
    "換個角度，再試一次。",
    "今天，也做一點喜歡的事。",
    "靈感有時候，只差一個點擊。",
  ];
  surprise.onclick = () => {
    document.querySelector(".kinetic-note").textContent =
      phrases[n++ % phrases.length];
    document.querySelector(".kinetic").classList.remove("pop");
    void document.querySelector(".kinetic").offsetWidth;
    document.querySelector(".kinetic").classList.add("pop");
  };
}

// Ocean interactions work with the current scene rather than the retired artwork.
const seaScene = document.querySelector(".ocean-scene");
if (seaScene && motionOK) {
  let scatterTimer;
  if (matchMedia("(pointer:fine)").matches) {
    seaScene.addEventListener("pointermove", (event) => {
      const box = seaScene.getBoundingClientRect();
      seaScene.style.setProperty(
        "--sea-x",
        ((event.clientX - box.left) / box.width - 0.5) * 22 + "px",
      );
      seaScene.style.setProperty(
        "--sea-y",
        ((event.clientY - box.top) / box.height - 0.5) * 12 + "px",
      );
    });
    seaScene.addEventListener("pointerleave", () => {
      seaScene.style.setProperty("--sea-x", "0px");
      seaScene.style.setProperty("--sea-y", "0px");
    });
  }
  seaScene.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    const box = seaScene.getBoundingClientRect();
    if (event.clientY - box.top < box.height * 0.43) return;
    const ripple = document.createElement("span");
    ripple.className = "water-ripple";
    ripple.style.left = event.clientX - box.left + "px";
    ripple.style.top = event.clientY - box.top + "px";
    seaScene.append(ripple);
    setTimeout(() => ripple.remove(), 950);
    seaScene.classList.add("scattered");
    clearTimeout(scatterTimer);
    scatterTimer = setTimeout(
      () => seaScene.classList.remove("scattered"),
      900,
    );
  });
}
const recordChart = document.querySelector(".local-chart");
if (recordChart) {
  const details = [
    "反應測試每回合開始、其他遊戲每局開始各計一次。",
    "文字處理或完成一次轉盤抽選，各計一次。",
    "完成反應回合、翻牌或限時點擊各計一次，猜謎猜中才計完成。",
  ];
  const tooltip = document.createElement("p");
  tooltip.className = "chart-tooltip";
  tooltip.setAttribute("role", "status");
  tooltip.textContent = "移到長條上，或用 Tab 選取，查看計算方式。";
  recordChart.after(tooltip);
  recordChart.querySelectorAll(".chart-bar").forEach((bar, i) => {
    bar.tabIndex = 0;
    bar.addEventListener(
      "pointerenter",
      () =>
        (tooltip.textContent =
          bar.innerText.replaceAll("\n", " ") + "：" + details[i]),
    );
    bar.addEventListener(
      "focus",
      () =>
        (tooltip.textContent =
          bar.innerText.replaceAll("\n", " ") + "：" + details[i]),
    );
  });
  const controls = document.createElement("div");
  controls.className = "chart-switch";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "紀錄分類");
  for (const [key, label] of [
    ["all", "全部"],
    ["games", "遊戲"],
    ["tools", "工具"],
  ]) {
    const button = document.createElement("button");
    button.textContent = label;
    button.classList.toggle("active", key === "all");
    button.setAttribute("aria-pressed", String(key === "all"));
    button.onclick = () => {
      controls.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      recordChart
        .querySelectorAll(".chart-bar")
        .forEach(
          (bar, i) =>
            (bar.hidden =
              key === "games" ? i === 1 : key === "tools" ? i !== 1 : false),
        );
      tooltip.textContent = "目前顯示：" + label + "紀錄。數值僅來自此瀏覽器。";
    };
    controls.append(button);
  }
  recordChart.before(controls);
}
