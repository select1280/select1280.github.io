'use strict';
const motionOK=!matchMedia('(prefers-reduced-motion: reduce)').matches;
if(motionOK){
 const observer=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('in-view');observer.unobserve(item.target)}}),{threshold:.08});
 document.querySelectorAll('.section-title,.info-panel,.about-grid,.page-heading,.activity').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
 const art=document.querySelector('.kinetic');
 if(art&&matchMedia('(pointer:fine)').matches){art.addEventListener('pointermove',e=>{const r=art.getBoundingClientRect();art.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5)*16+'px');art.style.setProperty('--my',((e.clientY-r.top)/r.height-.5)*16+'px')});art.addEventListener('pointerleave',()=>{art.style.setProperty('--mx','0px');art.style.setProperty('--my','0px')})}
 document.querySelectorAll('button,.profile-links a').forEach(el=>el.addEventListener('click',e=>{const r=el.getBoundingClientRect(),x=e.detail?e.clientX:r.left+r.width/2,y=e.detail?e.clientY:r.top+r.height/2;for(let i=0;i<7;i++){const bit=document.createElement('span');bit.className='click-spark';bit.style.left=x+'px';bit.style.top=y+'px';bit.style.setProperty('--dx',Math.cos(i/7*Math.PI*2)*45+'px');bit.style.setProperty('--dy',Math.sin(i/7*Math.PI*2)*45+'px');bit.style.background=['#ff885b','#53b5e8','#a698ed','#e9bd35'][i%4];document.body.append(bit);setTimeout(()=>bit.remove(),700)}}));
}
const surprise=document.querySelector('#surprise');if(surprise){let n=0;const phrases=['想法，正在發芽。','換個角度，再試一次。','今天，也做一點喜歡的事。','靈感有時候，只差一個點擊。'];surprise.onclick=()=>{document.querySelector('.kinetic-note').textContent=phrases[n++%phrases.length];document.querySelector('.kinetic').classList.remove('pop');void document.querySelector('.kinetic').offsetWidth;document.querySelector('.kinetic').classList.add('pop')}}
