import {$,renderCounts,lifecycle} from './core.js';
import {reaction,memory} from './games.js';
import {wheel,text} from './tools.js';
import './effects.js';
import './sea.js';
renderCounts();$('#year').textContent=new Date().getFullYear();
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.card').forEach(c=>c.hidden=b.dataset.filter!=='all'&&c.dataset.category!==b.dataset.filter)});
const titles={reaction:'ϟ 反應力測試',memory:'✿ 記憶翻牌',wheel:'◉ 海洋羅盤',text:'Aa 文字整理'};
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{lifecycle.cleanup();$('#modal-title').textContent=titles[b.dataset.open];$('#modal').showModal();({reaction,memory,wheel,text})[b.dataset.open]()});
$('#close').onclick=()=>$('#modal').close();$('#modal').addEventListener('close',()=>lifecycle.cleanup());

addEventListener('pagehide',()=>lifecycle.cleanup());
