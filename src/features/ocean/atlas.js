import { encounters,zones,normalizeAtlas,discoveryCount,unlocked,chooseEncounter,recordEncounter,creatureSVG } from './atlas-data.js';

export function initAtlas() {
  const scene=document.querySelector('.ocean-scene');
  if (!scene) return;
  const explore=document.querySelector('#sea-surprise'), message=document.querySelector('#sea-message');
  const controls=document.querySelector('#atlas-controls'), dialog=document.querySelector('#atlas-dialog');
  const key='littlebreak:ocean-atlas-v1';
  let state=normalizeAtlas(null), zone='surface', previous=null, timer=null, busy=false, replaying=false, pending=null;
  let storageOK=true;
  try { state=normalizeAtlas(JSON.parse(localStorage.getItem(key))); } catch { storageOK=false; }
  const layer=document.createElement('div'); layer.className='encounter-layer'; layer.setAttribute('aria-hidden','true');scene.append(layer);
  const ambient=document.createElement('div');ambient.className='atlas-ambient';ambient.setAttribute('aria-hidden','true');
  ambient.innerHTML=`<span class="ambient-turtle">${creatureSVG(encounters.find(item=>item.id==='turtle'))}</span><span class="ambient-jelly">${creatureSVG(encounters.find(item=>item.id==='jelly'))}</span>`;
  scene.append(ambient);
  function save() {
    try { localStorage.setItem(key,JSON.stringify(state));storageOK=true; } catch { storageOK=false; }
  }
  function render() {
    const total=discoveryCount(state);
    document.querySelector('#atlas-progress').textContent=`海洋圖鑑 · ${total}／12`;
    controls.querySelectorAll('[data-zone]').forEach(button=>{
      const available=unlocked(state,button.dataset.zone);
      button.disabled=busy||!available;
      button.setAttribute('aria-pressed',String(zone===button.dataset.zone));
      button.title=available?'探索'+button.dataset.label:`發現 ${zones.find(z=>z.id===button.dataset.zone).threshold} 種後解鎖`;
      button.textContent=button.dataset.label+(available?'':' 🔒');
    });
    explore.disabled=busy;
    explore.setAttribute('aria-label',busy?'正在探索海洋':'探索'+zones.find(z=>z.id===zone).name+'，發現海洋生物');
    explore.textContent=busy?'◌':'⌖';
    document.querySelector('#atlas-hint').textContent=total<3?'發現 3 種，解鎖淺海':total<7?'累積發現 7 種，解鎖深海':total<12?'三片海域已開放，繼續尋找未見過的身影。':'已集滿！打開圖鑑，看看專屬星海。';
    scene.dataset.zone=zone;
    renderDialog();
  }
  function renderDialog() {
    const total=discoveryCount(state);
    document.querySelector('#atlas-summary').textContent=`已發現 ${total}／12 種。收藏保存在此瀏覽器，換裝置不會同步。`;
    document.querySelector('#atlas-storage').textContent=storageOK?'':'目前無法儲存；本次收藏僅保留到離開頁面。';
    const content=document.querySelector('#atlas-entries');
    content.innerHTML=zones.map(region=>{
      const entries=encounters.filter(item=>item.zone===region.id);
      const count=entries.filter(item=>state.counts[item.id]).length;
      return `<section class="atlas-region"><div class="atlas-region-heading"><h3>${region.name} <small>${count}／4</small></h3><span class="atlas-badge ${count===4?'earned':''}">${count===4?'✦':'◇'} ${region.badge}</span></div><div class="atlas-grid">${entries.map(item=>{
        const found=state.counts[item.id]>0;
        return `<article class="atlas-entry ${found?'discovered':'undiscovered'}"><div class="atlas-art">${creatureSVG(item)}</div><h4>${found?item.name:'尚未遇見'}</h4><p>${found?item.detail:unlocked(state,region.id)?'這片海裡，還有等待發現的身影。':`累積發現 ${region.threshold} 種後開放此海域。`}</p>${found?`<button type="button" data-replay="${item.id}">再次欣賞 <span>遇見 ${state.counts[item.id]} 次</span></button>`:'<span class="atlas-unknown">? ? ?</span>'}</article>`;
      }).join('')}</div></section>`;
    }).join('');
    content.querySelectorAll('[data-replay]').forEach(button=>{button.disabled=busy;});
    const reward=document.querySelector('#atlas-reward');reward.hidden=total!==12;
    document.querySelector('#atlas-theme').setAttribute('aria-pressed',String(scene.classList.contains('star-sea')));
  }
  function finish() {
    timer=null;
    const oldTotal=discoveryCount(state), item=pending;
    if(!replaying) { state=recordEncounter(state,item.id);save(); }
    const total=discoveryCount(state), fresh=total>oldTotal;
    const region=zones.find(z=>z.id===item.zone);
    const completed=!replaying&&encounters.filter(entry=>entry.zone===item.zone).every(entry=>state.counts[entry.id])&&fresh;
    const opened=zones.filter(z=>oldTotal<z.threshold&&total>=z.threshold).map(z=>z.name);
    message.textContent=(replaying?'再次相遇：':fresh?'首次發現：':'又遇見了')+item.name+(opened.length?`！${opened.join('、')}已解鎖`:'')+(completed?` · 獲得「${region.badge}」`:'');
    layer.replaceChildren();scene.classList.remove('encounter-active');busy=false;pending=null;
    if(fresh&&total===12) {
      scene.classList.add('star-sea','atlas-celebrate');
      message.textContent='✦ 海洋探索家！12 種收藏完成，專屬星海已解鎖。';
    }
    render();
  }
  function play(item,replay=false) {
    if(busy||!item)return;
    busy=true;replaying=replay;pending=item;previous=item.id;
    scene.classList.remove('atlas-celebrate');scene.classList.add('encounter-active');
    scene.dataset.event=item.motion;
    layer.innerHTML=`<span class="sonar-ring"></span><div class="encounter-creature event-${item.motion}">${creatureSVG(item)}</div><span class="encounter-bubbles">○ · ◦</span>`;
    message.textContent=`${replay?'再次欣賞':'探索中'} · ${item.name}`;
    render();
    timer=setTimeout(finish,matchMedia('(prefers-reduced-motion: reduce)').matches?1000:5500);
  }
  explore.addEventListener('click',()=>{
    const item=chooseEncounter(state,zone,previous);
    if(item&&!busy){previous=item.id;play(item);}
  });
  controls.addEventListener('click',event=>{
    const button=event.target.closest('[data-zone]');
    if(!button||busy||!unlocked(state,button.dataset.zone))return;
    zone=button.dataset.zone;
    message.textContent=`正在探索${zones.find(z=>z.id===zone).name} · 點一下右下角聲納。`;render();
  });
  document.querySelector('#atlas-progress').addEventListener('click',()=>{
    renderDialog();dialog.showModal();document.body.classList.add('atlas-dialog-open');document.querySelector('#atlas-close').focus();
  });
  document.querySelector('#atlas-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.classList.remove('atlas-dialog-open');document.querySelector('#atlas-progress').focus();});
  document.querySelector('#atlas-entries').addEventListener('click',event=>{
    const button=event.target.closest('[data-replay]');if(!button||busy)return;
    const item=encounters.find(entry=>entry.id===button.dataset.replay);
    if(!item||!state.counts[item.id])return;
    zone=item.zone;dialog.close();play(item,true);
  });
  document.querySelector('#atlas-theme').addEventListener('click',()=>{
    if(discoveryCount(state)!==12)return;
    scene.classList.toggle('star-sea');renderDialog();
  });
  function cancel() {
    if(timer!==null)clearTimeout(timer);timer=null;
    if(busy){busy=false;pending=null;layer.replaceChildren();scene.classList.remove('encounter-active');message.textContent='探索暫停，回來後可以再試一次。';render();}
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
  addEventListener('pagehide',cancel);
  render();
}
