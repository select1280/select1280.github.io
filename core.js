export const $ = s => document.querySelector(s);
export const store = {get(k,f=0){try{return JSON.parse(localStorage.getItem('littlebreak:'+k))??f}catch{return f}},set(k,v){try{localStorage.setItem('littlebreak:'+k,JSON.stringify(v))}catch{}}};
export function count(k){store.set(k,Number(store.get(k))+1);renderCounts()}
export function renderCounts(){for(const [id,key] of [['play-count','plays'],['tool-count','tools'],['finish-count','finishes']]){const el=$('#'+id);if(el)el.textContent=Number(store.get(key)).toLocaleString('zh-TW')}}

export const lifecycle={cleanup:()=>{}};
export const motionOK=!matchMedia('(prefers-reduced-motion: reduce)').matches;
let toastTimer;
export function toast(message){clearTimeout(toastTimer);const el=$('#toast');el.textContent=message;el.style.display='block';toastTimer=setTimeout(()=>el.style.display='none',2400)}
