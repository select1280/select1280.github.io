import { store } from "../../shared/core.js";

export const CACHE_TTL = 30 * 60 * 1000;
const STALE_LIMIT = 24 * 60 * 60 * 1000;
export const cities = [
  { id: "taipei", name: "台北", lat: 25.04, lon: 121.56 },
  { id: "newtaipei", name: "新北", lat: 25.01, lon: 121.46 },
  { id: "keelung", name: "基隆", lat: 25.13, lon: 121.74 },
  { id: "taoyuan", name: "桃園", lat: 24.99, lon: 121.31 },
  { id: "hsinchu", name: "新竹", lat: 24.81, lon: 120.97 },
  { id: "taichung", name: "台中", lat: 24.15, lon: 120.67 },
  { id: "tainan", name: "台南", lat: 22.99, lon: 120.21 },
  { id: "kaohsiung", name: "高雄", lat: 22.63, lon: 120.3 },
  { id: "hualien", name: "花蓮", lat: 23.99, lon: 121.6 },
  { id: "taitung", name: "台東", lat: 22.76, lon: 121.14 },
];

export function describeWeather(code, isDay = 1) {
  if (code === 0) return { label: "晴朗", icon: isDay ? "☀" : "☾" };
  if ([1, 2].includes(code)) return { label: "晴時多雲", icon: "☁" };
  if (code === 3) return { label: "陰天", icon: "☁" };
  if ([45, 48].includes(code)) return { label: "有霧", icon: "≋" };
  if ([51, 53, 55].includes(code)) return { label: "毛毛雨", icon: "☂" };
  if ([56, 57, 66, 67].includes(code)) return { label: "凍雨", icon: "☂" };
  if ([61, 63, 65].includes(code)) return { label: "下雨", icon: "☂" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "降雪", icon: "❄" };
  if ([80, 81, 82].includes(code)) return { label: "陣雨", icon: "☂" };
  if ([95, 96, 99].includes(code)) return { label: "雷雨", icon: "ϟ" };
  return { label: "天氣概況", icon: "◌" };
}

export function normalizeWeather(payload) {
  const value = payload?.current;
  if (!value || typeof value.temperature_2m !== "number" ||
      !Number.isFinite(value.temperature_2m) ||
      !Number.isInteger(value.weather_code) ||
      ![0, 1].includes(value.is_day) ||
      typeof value.time !== "number" || !Number.isFinite(value.time) ||
      Number.isNaN(new Date(value.time * 1000).getTime()) ||
      payload?.current_units?.temperature_2m !== "°C") {
    throw new Error("天氣資料格式不完整");
  }
  return { temperature: value.temperature_2m, code: value.weather_code,
    isDay: value.is_day, time: value.time };
}

export function cacheUsable(entry, now, limit = CACHE_TTL) {
  const value = entry?.data;
  return Boolean(value && typeof entry.fetchedAt === "number" &&
    now >= entry.fetchedAt && now - entry.fetchedAt < limit &&
    typeof value.temperature === "number" && Number.isFinite(value.temperature) &&
    Number.isInteger(value.code) && [0, 1].includes(value.isDay) &&
    typeof value.time === "number" && Number.isFinite(value.time) &&
    value.time * 1000 <= now + 60 * 60 * 1000 &&
    now - value.time * 1000 < STALE_LIMIT);
}

export async function fetchWeather(city, signal, fetcher = fetch) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({ latitude: String(city.lat),
    longitude: String(city.lon), current: "temperature_2m,weather_code,is_day",
    timezone: "Asia/Taipei", timeformat: "unixtime", forecast_days: "1" });
  const response = await fetcher(url.toString(), { signal, credentials: "omit" });
  if (!response.ok) throw new Error("天氣服務暫時無法使用");
  return normalizeWeather(await response.json());
}

export function initWeather() {
  const bar = document.querySelector("#weather-bar");
  if (!bar) return;
  const select = bar.querySelector("select"), status = bar.querySelector("[role=status]");
  const retry = bar.querySelector("button"), stamp = bar.querySelector("time");
  for (const city of cities) {
    const option = document.createElement("option");
    option.value = city.id; option.textContent = city.name; select.append(option);
  }
  const preferred = store.get("weather-city", "taipei");
  select.value = cities.some(city => city.id === preferred) ? preferred : "taipei";
  let controller, sequence = 0;
  function display(data, stale = false) {
    const description = describeWeather(data.code, data.isDay);
    const icon = document.createElement("span"); icon.setAttribute("aria-hidden", "true");
    icon.className = "weather-icon"; icon.textContent = description.icon;
    status.replaceChildren(icon, document.createTextNode(
      description.label + " · " + Math.round(data.temperature) + "°C" +
      (stale ? "（上次資料）" : "")));
    const date = new Date(data.time * 1000);
    stamp.dateTime = date.toISOString();
    stamp.textContent = "資料 " + new Intl.DateTimeFormat("zh-TW", {
      timeZone: "Asia/Taipei", month: "numeric", day: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(date);
    bar.dataset.state = stale ? "stale" : "ready";
  }
  async function load() {
    const ticket = ++sequence;
    controller?.abort();
    const requestController = new AbortController(); controller = requestController;
    const city = cities.find(item => item.id === select.value);
    store.set("weather-city", city.id);
    const key = "weather-v1-" + city.id, cached = store.get(key, null), now = Date.now();
    retry.hidden = true; stamp.textContent = ""; stamp.removeAttribute("datetime");
    if (cacheUsable(cached, now)) { display(cached.data); return; }
    status.textContent = "天氣載入中…"; bar.dataset.state = "loading";
    const timeout = setTimeout(() => requestController.abort(), 8000);
    try {
      const data = await fetchWeather(city, requestController.signal);
      if (ticket !== sequence) return;
      const entry = { fetchedAt: Date.now(), data };
      if (!cacheUsable(entry, Date.now(), STALE_LIMIT)) throw Error("資料時間無效");
      store.set(key, entry); display(data);
    } catch {
      if (ticket !== sequence) return;
      if (cacheUsable(cached, Date.now(), STALE_LIMIT)) display(cached.data, true);
      else { status.textContent = "暫時無法取得天氣"; bar.dataset.state = "error"; }
      retry.hidden = false;
    } finally { clearTimeout(timeout); }
  }
  select.addEventListener("change", load); retry.addEventListener("click", load);
  addEventListener("pagehide", () => { sequence++; controller?.abort(); });
  load();
}
