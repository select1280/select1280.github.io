export const zones = [
  { id: 'surface', name: '海面', threshold: 0, badge: '乘風觀察家' },
  { id: 'reef', name: '淺海', threshold: 3, badge: '珊瑚海旅人' },
  { id: 'deep', name: '深海', threshold: 7, badge: '深藍尋光者' },
];

export const encounters = [
  { id:'flying', zone:'surface', name:'飛魚躍浪', motion:'leap', color:'#b8f4ed', detail:'一對展開的胸鰭，讓飛魚沿著海面滑翔。', art:'<path d="M18 54Q47 23 86 47L107 30L100 57L110 72L83 62Q44 77 18 54Z"/><path d="M40 51L12 15L72 44M45 61L25 84L76 61" class="fin"/><circle cx="29" cy="51" r="2" class="eye"/>' },
  { id:'dolphin', zone:'surface', name:'海豚跳躍', motion:'leap', color:'#87cce6', detail:'弧線劃過海面，海豚的尾鰭推動身體向前。', art:'<path d="M9 59L27 48Q41 18 77 43L94 58L112 45L104 65L112 79L90 71Q57 54 35 65L19 68Z"/><path d="M54 38L66 17L71 42M58 61L54 80L78 66" class="fin"/><circle cx="31" cy="51" r="2" class="eye"/>' },
  { id:'turtle', zone:'surface', name:'海龜換氣', motion:'turtle', color:'#88d8bd', detail:'海龜游到水面換氣，再悠閒地返回水中。', art:'<ellipse cx="60" cy="49" rx="30" ry="23"/><path d="M42 32Q13 5 25 39L38 45M76 32Q104 4 94 39L81 45M40 64L24 81L48 69M80 64L96 81L72 69" class="fin"/><ellipse cx="60" cy="18" rx="10" ry="13"/><path d="M60 27L44 43L48 60L70 63L78 44Z" class="shell"/><circle cx="56" cy="14" r="1.5" class="eye"/>' },
  { id:'whale', zone:'surface', name:'鯨魚浮出', motion:'whale', color:'#aacfe8', detail:'龐大的身影緩緩浮出，尾鰭揚起一道浪。', art:'<path d="M9 44Q14 20 50 30Q78 35 87 50L113 31L106 56L113 69L87 64Q60 88 28 67Q9 62 9 44Z"/><path d="M45 60L59 79L69 61" class="fin"/><path d="M27 29Q16 4 11 19M27 29Q29 3 40 14" class="line"/><circle cx="23" cy="45" r="2" class="eye"/>' },
  { id:'shoal', zone:'reef', name:'熱帶魚群', motion:'shoal', color:'#ffd493', detail:'不同大小的小魚結伴穿梭，隊形隨水流改變。', art:'<g><path d="M8 30Q25 13 43 30L55 20V42L43 34Q25 49 8 30Z"/><circle cx="18" cy="28" r="2" class="eye"/></g><g transform="translate(52 24)"><path d="M8 30Q25 13 43 30L55 20V42L43 34Q25 49 8 30Z"/><circle cx="18" cy="28" r="2" class="eye"/></g><g transform="translate(5 44) scale(.65)"><path d="M8 30Q25 13 43 30L55 20V42L43 34Q25 49 8 30Z"/><circle cx="18" cy="28" r="2" class="eye"/></g>' },
  { id:'jelly', zone:'reef', name:'水母漂浮', motion:'jelly', color:'#efc6ee', detail:'傘狀的身體一收一放，柔軟觸手隨波漂動。', art:'<path d="M25 48Q24 7 60 10Q96 7 95 48Q83 57 74 49Q60 60 47 49Q35 57 25 48Z"/><g class="tentacles"><path d="M36 52Q24 69 38 86M51 54Q66 73 48 88M68 54Q56 72 73 87M83 52Q99 68 84 82" class="line"/></g>' },
  { id:'ray', zone:'reef', name:'魟魚滑翔', motion:'ray', color:'#a5dbed', detail:'寬闊的胸鰭像雙翼，帶著身體貼近海底滑行。', art:'<path d="M60 22Q29 8 6 48Q35 45 51 65L60 60L69 65Q85 45 114 48Q91 8 60 22Z" class="wings"/><path d="M60 52Q73 76 58 90" class="line"/><circle cx="53" cy="31" r="2" class="eye"/><circle cx="67" cy="31" r="2" class="eye"/>' },
  { id:'octopus', zone:'reef', name:'章魚藏身', motion:'octopus', color:'#f4ad9c', detail:'章魚伸出腕足，在岩石旁悄悄觀察這位訪客。', art:'<path d="M36 46Q24 8 59 9Q95 7 84 46Q105 52 109 74Q94 86 86 62Q89 89 73 88L69 63Q64 94 53 90L51 63Q34 95 23 83L38 59Q18 83 9 70Q13 54 36 46Z"/><circle cx="47" cy="32" r="3" class="eye"/><circle cx="71" cy="32" r="3" class="eye"/>' },
  { id:'angler', zone:'deep', name:'燈籠魚現身', motion:'angler', color:'#93bad1', detail:'黑暗中先亮起一點微光，接著才看見燈籠魚的輪廓。', art:'<path d="M14 56Q29 18 75 40L102 26L96 53L108 74L77 66Q39 88 14 56Z"/><path d="M51 37Q39 1 20 18" class="line"/><circle cx="19" cy="18" r="6" class="glow"/><path d="M18 57L37 51L31 64Z" class="eye"/><circle cx="42" cy="46" r="3" class="eye"/>' },
  { id:'glowjelly', zone:'deep', name:'發光水母', motion:'glowjelly', color:'#95f8ec', detail:'深海水母的輪廓發出脈動微光，像一盞漂浮的燈。', art:'<path d="M28 47Q30 8 60 9Q90 8 92 47Q60 65 28 47Z" class="glow"/><path d="M43 50Q22 71 44 89M59 53Q77 73 59 91M77 50Q96 75 76 87" class="line"/><path d="M42 40Q60 24 78 40" class="shell"/>' },
  { id:'squid', zone:'deep', name:'巨型烏賊剪影', motion:'squid', color:'#819bc7', detail:'狹長的剪影從深處掠過，腕足最後消失在藍色裡。', art:'<path d="M9 42L58 15L84 42L58 68Z"/><path d="M33 29L57 3L63 22M34 55L57 82L64 61" class="fin"/><path d="M80 36Q105 14 113 29M80 42Q106 32 116 47M80 48Q104 65 112 72M75 54Q92 92 106 79" class="line"/><circle cx="71" cy="40" r="3" class="eye"/>' },
  { id:'bloom', zone:'deep', name:'生物螢光潮', motion:'bloom', color:'#93f4df', detail:'細小光點隨水流亮起，像海洋裡的一片星空。', art:'<g class="glow"><circle cx="20" cy="25" r="4"/><circle cx="48" cy="14" r="2"/><circle cx="81" cy="25" r="5"/><circle cx="104" cy="49" r="3"/><circle cx="65" cy="51" r="3"/><circle cx="32" cy="61" r="5"/><circle cx="82" cy="79" r="4"/><circle cx="17" cy="83" r="2"/><circle cx="50" cy="81" r="2"/></g>' },
];

export function normalizeAtlas(raw) {
  const counts = Object.fromEntries(encounters.map(item => {
    const value = raw?.counts?.[item.id];
    return [item.id, Number.isSafeInteger(value) && value > 0 ? Math.min(value,999999) : 0];
  }));
  const misses = Object.fromEntries(zones.map(zone => [zone.id,
    Number.isInteger(raw?.misses?.[zone.id]) ? Math.max(0,Math.min(3,raw.misses[zone.id])) : 0]));
  return { version:1, counts, misses };
}
export const discoveryCount = state => encounters.filter(item => state.counts[item.id] > 0).length;
export const unlocked = (state, zoneId) => discoveryCount(state) >= zones.find(zone => zone.id===zoneId).threshold;

export function chooseEncounter(state, zoneId, previousId, random = Math.random) {
  if (!zones.some(zone=>zone.id===zoneId) || !unlocked(state,zoneId)) return null;
  const pool=encounters.filter(item=>item.zone===zoneId);
  const unseen=pool.filter(item=>!state.counts[item.id]);
  const eligible=state.misses[zoneId]>=3 && unseen.length ? unseen : pool.filter(item=>item.id!==previousId);
  return eligible[Math.min(eligible.length-1,Math.max(0,Math.floor(random()*eligible.length)))];
}
export function recordEncounter(state,id) {
  const item=encounters.find(entry=>entry.id===id);
  if (!item || !unlocked(state,item.zone)) return state;
  const next=normalizeAtlas(state), fresh=!next.counts[id];
  next.counts[id]=Math.min(999999,next.counts[id]+1);
  next.misses[item.zone]=fresh?0:Math.min(3,next.misses[item.zone]+1);
  return next;
}
export function creatureSVG(item) {
  return `<svg viewBox="0 0 120 100" aria-hidden="true" style="--creature-color:${item.color}">${item.art}</svg>`;
}
