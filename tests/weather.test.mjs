import assert from "node:assert/strict";
globalThis.matchMedia = () => ({ matches: false });
const {CACHE_TTL,describeWeather,normalizeWeather,cacheUsable,fetchWeather,cities} =
  await import('../src/features/weather/weather.js');
const now = Date.UTC(2026,9,30,6,0), data = {
  temperature: 24.4, code: 3, isDay: 1, time: now / 1000,
};
assert.equal(describeWeather(0,0).icon,'☾');
assert.equal(describeWeather(95).label,'雷雨');
assert.equal(describeWeather(999).label,'天氣概況');
const payload = {current:{temperature_2m:24.4,weather_code:3,is_day:1,time:now/1000},
  current_units:{temperature_2m:'°C'}};
assert.deepEqual(normalizeWeather(payload), data);
assert.throws(()=>normalizeWeather({current:{...payload.current,temperature_2m:null}}));
assert.throws(()=>normalizeWeather({...payload,current_units:{temperature_2m:'°F'}}));
assert.ok(cacheUsable({fetchedAt:now,data},now));
assert.ok(!cacheUsable({fetchedAt:now,data},now+CACHE_TTL));
assert.ok(!cacheUsable({fetchedAt:now+1,data},now));
assert.ok(!cacheUsable({fetchedAt:now,data:{...data,time:(now-86400001)/1000}},now));
assert.ok(!cacheUsable({fetchedAt:now,data:{...data,temperature:null}},now));
let requested;
assert.deepEqual(await fetchWeather(cities[0],undefined,async(url,options)=>{
  requested=new URL(url); assert.equal(options.credentials,'omit');
  return {ok:true,json:async()=>payload};
}),data);
assert.equal(requested.searchParams.get('timeformat'),'unixtime');
assert.equal(requested.searchParams.get('latitude'),'25.04');
assert.equal(requested.searchParams.get('current'),'temperature_2m,weather_code,is_day');
await assert.rejects(()=>fetchWeather(cities[0],undefined,async()=>({ok:false})));
await assert.rejects(()=>fetchWeather(cities[0],undefined,async()=>{throw Error('offline')}));
console.log('通過：天氣代碼、單位與空值檢查、快取期限、未來與過期資料、API 參數、離線與錯誤回應。');
