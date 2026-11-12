/* Profile links come from config/site-config.js (window.SITE); the hrefs in the markup are only fallbacks. */
const SITE=window.SITE||{},cfgVal=k=>typeof SITE[k]==='string'&&SITE[k].trim();
document.querySelectorAll('[data-cfg]').forEach(a=>{const v=cfgVal(a.dataset.cfg);if(v)a.href=a.dataset.cfg==='email'?'mailto:'+v:v});
document.querySelectorAll('[data-cfg-text]').forEach(el=>{const v=cfgVal(el.dataset.cfgText);if(v)el.textContent=v});
document.querySelectorAll('[data-repo]').forEach(a=>{const g=cfgVal('github');if(g)a.href=g.replace(/\/+$/,'')+'/'+a.dataset.repo});
const contactEmail='email' in SITE?String(SITE.email).trim():'angajalashashikumar@gmail.com'; // Empty email in config/site-config.js = the quote form downloads a .txt brief instead.
const $=s=>document.querySelector(s), reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Effect switches (config/site-config.js `effects`). A missing switch counts as on; `false` restores the original behaviour. */
const FX=Object.assign({wingReveal:true,wingFlap3D:true,scrollStory:true},(window.SITE&&window.SITE.effects)||{});
/* 2D wingbeat shared by every canvas butterfly (flock, swarm, wordmark): slow upstroke, a brief clap, a fast
   downstroke. flapOpen(p) is the cosine-like opening (1 open, ~0 clapped); the tip uses a lagged phase so it trails. */
function flapOpen(p){p-=Math.floor(p);if(p<.54){const u=p/.54;return 1-.93*u*u*(3-2*u)}if(p<.575)return .07;if(p<.76){const u=(p-.575)/.185;return .07+.98*u*u}return 1.05-.05*(p-.76)/.24}
function flyPath(c,x,y,s,p){const o=flapOpen(p),g=flapOpen(p-.07),lift=(1-o)*.55;c.beginPath();
 for(let d=-1;d<2;d+=2){c.moveTo(x,y);c.quadraticCurveTo(x+d*s*2.1*o,y-s*(2.1+lift),x+d*s*1.95*g,y-s*(.45+lift));c.quadraticCurveTo(x+d*s*1.3*g,y+s*.75,x,y+s*.25)}}
/* Service icons: inline line art in the project-card style (ink stroke + one emerald accent). */
const SVC_ICONS={
 manual:'<circle cx="21" cy="21" r="11"/><path d="M29 29 39 39"/><circle class="acc" cx="21" cy="21" r="3.2"/><path d="M16 12.5l-2.5-3M26 12.5l2.5-3"/>',
 auto:'<path d="M38 20a15 15 0 0 0-27-5"/><path d="M10 9v6h6"/><path d="M10 28a15 15 0 0 0 27 5"/><path d="M38 39v-6h-6"/><path class="acc" d="M20 18.5v11l9-5.5z"/>',
 api:'<rect x="5" y="15" width="12" height="18" rx="3"/><rect x="31" y="15" width="12" height="18" rx="3"/><path d="M19 20h10M25 16.5l4 3.5-4 3.5"/><path d="M29 28H19M23 24.5 19 28l4 3.5"/><circle class="acc" cx="11" cy="24" r="2.4"/>',
 regress:'<path d="M37 24a13 13 0 1 1-4-9.4"/><path d="M34 8v7h-7"/><path class="acc-s" d="M18 24.5l4.5 4.5 8-9"/>',
 desktop:'<rect x="6" y="9" width="36" height="24" rx="3"/><path d="M6 15h36M18 39h12M24 33v6"/><circle class="acc" cx="10.5" cy="12" r="1.4"/><rect class="acc" x="12" y="20" width="14" height="3" rx="1.5"/><rect x="12" y="26" width="9" height="3" rx="1.5"/>',
 consult:'<rect x="10" y="9" width="28" height="33" rx="3"/><path d="M19 6h10v6H19z"/><path d="M17 21h3M24 21h9M17 28h3M24 28h9M17 35h3M24 35h6"/><path class="acc-s" d="M16 21l1.5 1.5 3-3.5"/>'};
const svcIcon=k=>'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'+SVC_ICONS[k]+'</svg>';
const services=[['manual','Manual Testing','Exploratory sessions and reproducible defect reports for critical user journeys.'],['auto','Automation Testing','Repeatable Java checks for stable workflows and frequent releases.'],['api','API Testing','Request validation, error contracts, and state checks across endpoints.'],['regress','Regression Testing','Risk-based coverage of changed features and their dependencies.'],['desktop','Desktop Application Testing','Windows UI, installer, multi-system, and build compatibility checks.'],['consult','QA Consulting','A practical test strategy, release criteria, and a prioritized coverage plan.']];
$('#serviceList').innerHTML=services.map(([i,t,d])=>'<article class="card"><span class="glyph svc-ico" aria-hidden="true">'+svcIcon(i)+'</span><h3>'+t+'</h3><p>'+d+'</p></article>').join('');
const MICRO='<svg viewBox="0 0 22 16"><g fill="currentColor" class="fwl"><path d="M11 8C8 2 3 0 1.5 2.5 0 5.5 5 9 11 8Z"/><path d="M11 8C7 8.5 3 10 2.5 12.5 2.5 15 8 13.5 11 8Z" opacity=".75"/></g><g fill="currentColor" class="fwr"><path d="M11 8C14 2 19 0 20.5 2.5 22 5.5 17 9 11 8Z"/><path d="M11 8C15 8.5 19 10 19.5 12.5 19.5 15 14 13.5 11 8Z" opacity=".75"/></g><ellipse cx="11" cy="8.4" rx=".9" ry="3.4" fill="#1c2415"/></svg>';
function dust(x,y,color,count=7){if(reduced())return;for(let i=0;i<count;i++){const s=document.createElement('i');s.className='spark flit';s.innerHTML=MICRO;s.style.cssText='left:'+x+'px;top:'+y+'px;color:'+color+';width:'+(12+Math.random()*12)+'px;--x:'+(Math.random()-.5)*130+'px;--y:'+(-24-Math.random()*85)+'px;--r:'+(Math.random()-.5)*70+'deg;--fs:'+(.16+Math.random()*.12)+'s';document.body.append(s);setTimeout(()=>s.remove(),1500)}}
/* Click blooms: every click frees its own flock; every 4th click spirals. */
const flockPals=[['#4fe39a','#2fa96b','#aef7cf'],['#e8c35a','#d9a93f','#f7e8b0'],['#b88ae8','#9a6fd0','#e4d1ff'],['#7fd8e8','#4fb8d0','#d8f4fa']];
let clickN=0;
function burst(x,y){if(reduced())return;clickN++;const pal=flockPals[Math.random()*flockPals.length|0];
 const ring=document.createElement('i');ring.className='ripple';ring.style.cssText='left:'+x+'px;top:'+y+'px;border-color:'+pal[0];document.body.append(ring);setTimeout(()=>ring.remove(),900);
 const spiral=clickN%4===0,n=spiral?10:8;
 for(let i=0;i<n;i++){const col=pal[i%pal.length];
  if(spiral){const w=document.createElement('i');w.className='vortex';w.style.cssText='left:'+x+'px;top:'+y+'px;--a:'+(i/n*360)+'deg;--sp:'+(1+Math.random()*.5)+'s';w.innerHTML='<i class="vfly" style="color:'+col+';width:'+(11+Math.random()*9)+'px;--fs:'+(.14+Math.random()*.1)+'s">'+MICRO+'</i>';document.body.append(w);setTimeout(()=>w.remove(),1700)}
  else{const a=i/n*6.283+Math.random()*.5,r=55+Math.random()*85,dx=Math.cos(a)*r,dy=Math.sin(a)*r*.8;const s=document.createElement('i');s.className='spark flit bloom';s.innerHTML=MICRO;s.style.cssText='left:'+x+'px;top:'+y+'px;color:'+col+';width:'+(12+Math.random()*10)+'px;--x:'+dx+'px;--y:'+dy+'px;--y2:'+(dy-55-Math.random()*55)+'px;--r:'+(Math.random()-.5)*80+'deg;--fs:'+(.15+Math.random()*.1)+'s';document.body.append(s);setTimeout(()=>s.remove(),1800)}}}
document.addEventListener('click',e=>{if(e.detail===0||e.target.closest('input,textarea,select,label'))return;burst(e.clientX,e.clientY)});
/* Living wordmark: butterflies fly in and FORM the name, scatter on hover, re-form after. */
(function(){const cv=$('#brandfly');if(!cv)return;
 const W=206,H=46,DPR=Math.min(devicePixelRatio||1,2);
 cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
 const c=cv.getContext('2d');c.scale(DPR,DPR);
 const BFONT='700 40px Georgia,serif';
 const off=document.createElement('canvas');off.width=W;off.height=H;const oc=off.getContext('2d');
 oc.font=BFONT;oc.textBaseline='middle';oc.fillText('SHASHI',3,H/2+2);
 const img=oc.getImageData(0,0,W,H).data,pts=[];
 for(let y=1;y<H;y+=3)for(let x=1;x<W;x+=3)if(img[(y*W+x)*4+3]>128)pts.push({x:x+Math.random()*.6-.3,y:y+Math.random()*.6-.3});
 /* Grove palette (light / night): the swarm wears the site's emeralds, then settles into crisp ink text. */
 const pals={light:['#2fa96b','#1d5c3c','#4fbf86','#294936','#6b8655','#15a05f'],dark:['#4fe39a','#aef7cf','#9fca8f','#c7e6a6','#2fa96b','#d9edab']};
 const inks={light:'#213d34',dark:'#e3ecda'},night=()=>document.documentElement.dataset.theme==='dark'?'dark':'light';
 const flies=pts.map(p=>({hx:p.x,hy:p.y,x:p.x+(Math.random()-.5)*280,y:p.y+(Math.random()-.5)*170,
  delay:p.x*4+Math.random()*400,ph:Math.random()*6.28,fs:3.5+Math.random()*4,sz:1.3+Math.random()*.9,
  k:(Math.random()*6)|0,sx:(Math.random()-.5)*44,sy:(Math.random()-.5)*26}));
 let hover=false,scat=0,bf=0,t0=0;const sceneRef=$('#intro');
 function drawBrand(t){bf=0;if(document.hidden||reduced()){c.clearRect(0,0,W,H);return}
  if(!sceneRef.classList.contains('done'))t0=t;const age=t-(t0||t),mode=night(),pal=pals[mode];
  scat+=((hover?1:0)-scat)*.07;
  /* settle: 0 while the swarm forms, 1 once the word is crisp text; hovering lifts the swarm back off it. */
  const settle=Math.max(0,Math.min(1,(age-2700)/900)),text=settle*(1-scat),swarmA=1-text;
  c.clearRect(0,0,W,H);
  if(age>2200){c.globalAlpha=Math.max(.14*(1-scat),text);c.fillStyle=inks[mode];c.font=BFONT;c.textBaseline='middle';c.fillText('SHASHI',3,H/2+2);c.globalAlpha=1}
  if(swarmA>.01){c.globalAlpha=swarmA;
  for(const f of flies){
   if(age>f.delay){const tx=f.hx+f.sx*scat,ty=f.hy+f.sy*scat;f.x+=(tx-f.x)*.07;f.y+=(ty-f.y)*.07}
   const x=f.x+Math.sin(t/700+f.ph)*.6,y=f.y+Math.cos(t/900+f.ph)*.6;
   c.fillStyle=pal[f.k];
   if(FX.wingFlap3D)flyPath(c,x,y,f.sz,t/1000*(f.fs+scat*3)/3.1416+f.ph/6.283);
   else{const flap=.25+.75*Math.abs(Math.sin(t/1000*(f.fs+scat*3)+f.ph)),s=f.sz;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-s*2*flap,y-s*2,x-s*flap,y+s*.5);c.lineTo(x,y);c.quadraticCurveTo(x+s*2*flap,y-s*2,x+s*flap,y+s*.5)}
   c.fill()}
  c.globalAlpha=1}
  /* Once settled and not hovered, the last frame stays on the canvas and the loop sleeps. */
  if(settle>=1&&!hover&&scat<.002&&sceneRef.classList.contains('done')){for(const f of flies){f.x=f.hx;f.y=f.hy}scat=0;return}
  bf=requestAnimationFrame(drawBrand)}
 function brandGo(){if(!bf&&!reduced()&&!document.hidden)bf=requestAnimationFrame(drawBrand)}
 const brand=cv.closest('strong');
 brand.addEventListener('pointerenter',()=>{hover=true;brandGo()});brand.addEventListener('pointerleave',()=>{hover=false;brandGo()});
 document.addEventListener('visibilitychange',brandGo);
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',brandGo);
 /* Theme flips and intro replays wake the sleeping loop. */
 const wake=new MutationObserver(brandGo);wake.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});wake.observe(sceneRef,{attributes:true,attributeFilter:['class']});
 brandGo()})();
const hero=$('.bloom'),guide=hero.cloneNode(true);guide.className='guide';document.body.append(guide);
function land(x,y){guide.style.left=Math.max(0,Math.min(innerWidth-55,x))+'px';guide.style.top=Math.max(0,Math.min(innerHeight-32,y))+'px'}
function scrollGuideAt(ct){guide.hidden=scrollY<420;land(innerWidth*.93,ct<innerHeight*.65?innerHeight*.31:innerHeight*.72)}
function scrollGuide(){scrollGuideAt($('#contact').getBoundingClientRect().top)}
function butterfly(host,prefix,tpl){const svg=$(tpl||'#butterfly-shape').content.firstElementChild.cloneNode(true);for(const el of svg.querySelectorAll('[id]')){const old=el.id;el.id=prefix+old;for(const p of svg.querySelectorAll('[fill="url(#'+old+')"]'))p.setAttribute('fill','url(#'+el.id+')');for(const p of svg.querySelectorAll('[filter="url(#'+old+')"]'))p.setAttribute('filter','url(#'+el.id+')')}const wl=svg.querySelector('.wing-left');
 /* wingFlap3D off (or reduced motion): the original single SVG, flapped flat by the old CSS on .wing-left/.wing-right. */
 if(!wl||!FX.wingFlap3D||reduced()){host.replaceChildren(svg);return}
 /* Swallowtail: each wing half (hind, fore) becomes its own <svg> layer on the shared viewBox so CSS can turn it in 3D
    on the body hinge; gradients/filters stay in the body layer and are referenced across layers by their remapped ids. */
 const NS='http://www.w3.org/2000/svg',vb=svg.getAttribute('viewBox'),wr=svg.querySelector('.wing-right');
 const layer=(cls,node,mirror)=>{const l=document.createElementNS(NS,'svg');l.setAttribute('viewBox',vb);l.setAttribute('class','bf-layer '+cls);l.setAttribute('aria-hidden','true');l.setAttribute('focusable','false');
  if(mirror){const g=document.createElementNS(NS,'g');g.setAttribute('transform','translate(540 0) scale(-1 1)');g.append(node);l.append(g)}else l.append(node);return l};
 const body=layer('bf-body',svg.querySelector('defs'));body.append(svg.querySelector('.bf-bodyg'));
 const wrap=document.createElement('span');wrap.className='morpho bfly';wrap.setAttribute('role','img');wrap.setAttribute('aria-label',svg.getAttribute('aria-label')||'Butterfly');
 const rig=document.createElement('span');rig.className='bf-rig';
 rig.append(layer('bf-l bf-hind',wl.querySelector('.hind')),layer('bf-r bf-hind',wr.querySelector('.hind'),true),layer('bf-l bf-fore',wl.querySelector('.fore')),layer('bf-r bf-fore',wr.querySelector('.fore'),true),body);
 wrap.append(rig);host.replaceChildren(wrap)}
butterfly(hero,'hero-');butterfly($('#introShape'),'opening-');butterfly($('.emerged'),'journey-');butterfly(guide,'guide-');butterfly($('.d1 i'),'d1-');butterfly($('.d2'),'d2-');butterfly($('.d3'),'d3-');butterfly($('.larva'),'larva-','#caterpillar-shape');butterfly($('.bug'),'bug-','#caterpillar-shape');butterfly($('.mark'),'logo-');butterfly($('.perch'),'perch-');
const seen=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');seen.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('[data-reveal]').forEach(el=>seen.observe(el));
const countUp=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;countUp.unobserve(e.target);const el=e.target,n=+el.dataset.n,suffix=el.dataset.s||'';if(reduced()){el.textContent=n+suffix;return}let t0;const tick=ts=>{t0=t0||ts;const p=Math.min((ts-t0)/1300,1);el.textContent=Math.round(n*p*(2-p))+suffix;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}),{threshold:.6});
document.querySelectorAll('.stat b[data-n]').forEach(el=>countUp.observe(el));
document.querySelectorAll('main section:not(.hero) h2').forEach(h=>{if(reduced())return;
 h.setAttribute('aria-label',h.textContent.trim().replace(/\s+/g,' '));
 (function wrapWords(node){[...node.childNodes].forEach(ch=>{
  if(ch.nodeType===3){const frag=document.createDocumentFragment();ch.textContent.split(/(\s+)/).forEach(tok=>{if(!tok)return;if(/^\s+$/.test(tok))frag.append(tok);else{const sp=document.createElement('span');sp.className='w';sp.textContent=tok;frag.append(sp)}});ch.replaceWith(frag)}
  else if(ch.nodeType===1&&ch.tagName!=='BR')wrapWords(ch)})})(h);
 h.querySelectorAll('.w').forEach((w,i)=>w.style.setProperty('--wi',i));
 h.classList.add('wsplit');seen.observe(h)});
const prog=$('.pageprog i'),walker=$('.pageprog .walker');let arrived=false;
butterfly(walker,'walk-','#caterpillar-shape');
function pageProg(){const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?Math.min(scrollY/max,1):0;prog.style.width=p*100+'%';walker.style.left=p*100+'%';if(p>.985&&!arrived){arrived=true;walker.classList.add('arrived');butterfly(walker,'walkfly-')}else if(p<.9&&arrived){arrived=false;walker.classList.remove('arrived');butterfly(walker,'walk-','#caterpillar-shape')}}
addEventListener('scroll',()=>requestAnimationFrame(pageProg),{passive:true});pageProg();
/* Field games: one floating quest orb tracks every game; each cleared game gets a butterfly celebration. */
const quest=$('.quest'),questOrb=$('#questOrb'),questPanel=$('#questPanel'),questTip=$('#questTip'),questLive=$('#questLive');
/* Game progress lives only in this page view: every load, refresh or new browser starts all games from zero.
   (The theme choice is the only thing remembered, as "sk-theme".) Old saved progress from earlier versions is removed. */
const store={get(k,d){try{const v=localStorage.getItem('sk-'+k);return v==null?d:JSON.parse(v)}catch{return d}},set(k,v){try{localStorage.setItem('sk-'+k,JSON.stringify(v))}catch{}},clear(){try{Object.keys(localStorage).filter(k=>k.startsWith('sk-')&&k!=='sk-theme').forEach(k=>localStorage.removeItem(k))}catch{}}};
store.clear();const savedGames={},games={},questList=$('#questList');
const playable=id=>!(games[id].motion&&reduced());
/* addGame(id,{name,desc,total,tips,win,href,icon,motion}): registers a game and its row in the orb panel. Other scripts (arcade.js) call it too. */
function addGame(id,def){const g=games[id]=Object.assign({tips:[]},def);g.n=0;
 const li=document.createElement('li');li.dataset.game=id;li.innerHTML='<span class="gico" aria-hidden="true"></span><div><b></b><small></small><i class="gbar"><i></i></i></div><span class="gcount"><span class="gn">0</span>/'+g.total+'</span>';
 const b=li.querySelector('b');if(g.href){const a=document.createElement('a');a.href=g.href;a.textContent=g.name;a.addEventListener('click',()=>questToggle(false));b.append(a)}else b.textContent=g.name;
 li.querySelector('small').textContent=g.desc;const ico=li.querySelector('.gico');
 if(g.icon==='cater')butterfly(ico,'g'+id+'-','#caterpillar-shape');else if(g.icon==='fly')butterfly(ico,'g'+id+'-');else ico.innerHTML=g.icon||'';
 questList.append(li);questRender();return g}
butterfly($('.quest .qicon'),'qicon-','#caterpillar-shape');
function questRender(){let sum=0,tot=0;
 for(const[id,g]of Object.entries(games)){const li=questList.querySelector('[data-game="'+id+'"]');li.hidden=!playable(id);li.querySelector('.gn').textContent=g.n;li.querySelector('.gbar i').style.width=g.n/g.total*100+'%';li.classList.toggle('won',g.n>=g.total);if(playable(id)){sum+=g.n;tot+=g.total}}
 $('#questBadge').textContent=sum+'/'+tot;$('.ring .fill').style.strokeDashoffset=100-(tot?sum/tot*100:0);
 questOrb.setAttribute('aria-label','Page games, '+sum+' of '+tot+' steps complete');
 quest.classList.toggle('started',sum>0);
 const all=tot>0&&sum===tot;if(all!==quest.classList.contains('alldone')){quest.classList.toggle('alldone',all);butterfly($('.quest .qicon'),all?'qwin-':'qicon-',all?undefined:'#caterpillar-shape')}}
addGame('hunt',{name:'Bug hunt',total:5,icon:'cater',desc:'Five bugs escaped into the page. Look closely, and open things.',tips:['Bug caught · 1 of 5','Bug caught · 2 of 5','Bug caught · 3 of 5','One more hiding… 4 of 5'],win:'All five escaped bugs caught, and every one became a butterfly.'});
addGame('catch',{name:'Butterfly catch',total:3,icon:'fly',motion:true,href:'#home',desc:'Wild swallowtails fly over the opening scene. Catch three of them.',tips:['Caught a wild swallowtail · 1 of 3','Two down · 2 of 3'],win:'Three wild swallowtails caught over the grove. Quick hands.'});
addGame('lab',{name:'Defect lab',total:2,href:'#lab',icon:'<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M14.5 14.5 20 20" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="10" cy="10" r="2" fill="#4fe39a"/></svg>',desc:'Reproduce the defect in the QA lab, then verify the fix.',tips:['Defect reproduced. Now verify the fix on the patched build.'],win:'You reproduced the defect and verified the fix. That is the whole job.'});
$('#questReset').onclick=()=>{store.clear();location.reload()};
let tipTimer=0;
function tip(text,ms=2800){questLive.textContent=text;if(!questPanel.hidden)return;questTip.textContent=text;questTip.classList.add('show');clearTimeout(tipTimer);tipTimer=setTimeout(()=>questTip.classList.remove('show'),ms)}
function score(id){const g=games[id];if(!g||g.n>=g.total)return false;g.n++;questRender();
 window.dispatchEvent(new CustomEvent('gameprogress',{detail:{id,n:g.n,total:g.total}}));
 questOrb.classList.remove('pulse');void questOrb.offsetWidth;questOrb.classList.add('pulse');
 if(g.n<g.total){tip(g.tips[g.n-1]||g.name+' · '+g.n+' of '+g.total);return true}
 const all=Object.keys(games).every(k=>!playable(k)||games[k].n>=games[k].total);
 window.dispatchEvent(new CustomEvent('gamecomplete',{detail:{id,all}}));
 if(all)celebrate('Every game cleared','Every game on this page is cleared. You test like a pro. <a href="#contact">Let&rsquo;s talk ↗</a>',true);
 else{const left=Object.keys(games).filter(k=>playable(k)&&games[k].n<games[k].total).length;celebrate(g.name+' complete',g.win+' '+left+(left===1?' more game waits':' more games wait')+' in the orb.',false)}
 return true}
function questToggle(open){questPanel.hidden=!open;questOrb.setAttribute('aria-expanded',open);if(open){questTip.classList.remove('show');clearTimeout(tipTimer)}}
questOrb.onclick=()=>questToggle(questPanel.hidden);
document.addEventListener('pointerdown',e=>{if(!questPanel.hidden&&!quest.contains(e.target))questToggle(false)});
let questHinted=false;
/* The games hint waits until the visitor reaches the playground band, so it never covers the professional sections. */
function questHint(){if(questHinted)return;questHinted=true;const pg=document.getElementById('playground');if(!pg)return;new IntersectionObserver((es,o)=>{if(!es.some(e=>e.isIntersecting))return;o.disconnect();if(!quest.classList.contains('started'))tip(Object.keys(games).filter(playable).length+' little games are hidden on this page. Tap me to see them.',5200)},{threshold:.4}).observe(pg)}
/* Celebration: a card with an emerging butterfly and a canvas swarm bursting from it. */
const cel=$('#celebrate'),sw=$('#swarm'),swc=sw.getContext('2d');let celTimer=0,celN=0,swFlies=[],swFrame=0,swLast=0,swW=0,swH=0;
function celebrate(title,msg,grand){$('#celTitle').textContent=title;$('#celMsg').innerHTML=msg;$('.cel-card small').textContent=grand?'All games complete':'Game complete';butterfly($('.cel-fly'),'cel'+(++celN)+'-');
 cel.classList.toggle('grand',grand);$('#celBadge').hidden=!grand;cel.hidden=false;cel.classList.remove('show');void cel.offsetWidth;cel.classList.add('show');questToggle(false);
 questLive.textContent=title+'. '+$('#celMsg').textContent;swarm(grand?340:170,grand);celArm(grand?9500:6500)}
function celArm(ms){clearTimeout(celTimer);celTimer=setTimeout(celHide,ms)}
function celHide(){clearTimeout(celTimer);cel.classList.remove('show');setTimeout(()=>{if(!cel.classList.contains('show'))cel.hidden=true},500)}
/* "Keep exploring" carries the visitor to the resume card, which beckons with a butterfly burst. */
$('#celClose').onclick=()=>{celHide();const c=$('.flycta.resume');c.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'});c.classList.remove('beckon');void c.offsetWidth;c.classList.add('beckon');
 setTimeout(()=>{c.focus({preventScroll:true});const r=c.getBoundingClientRect();dust(r.left+r.width/2,r.top+r.height/2,'#e8c35a',18)},reduced()?0:850)};$('.cel-card').addEventListener('pointerenter',()=>clearTimeout(celTimer));$('.cel-card').addEventListener('pointerleave',()=>celArm(2500));
$('#celMsg').addEventListener('click',e=>{if(e.target.closest('a'))celHide()});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!cel.hidden)celHide();if(!questPanel.hidden){questToggle(false);questOrb.focus()}});
function swarm(n,grand){if(reduced())return;const d=Math.min(devicePixelRatio||1,2);swW=innerWidth;swH=innerHeight;sw.width=swW*d;sw.height=swH*d;swc.setTransform(d,0,0,d,0,0);
 const pal=grand?['#e8c35a','#f7e8b0','#4fe39a','#aef7cf','#b88ae8','#7fd8e8','#ffffff']:['#4fe39a','#2fa96b','#aef7cf','#e9ffd4','#d9b23f'],cx=swW/2,cy=swH*.42;
 for(let i=0;i<n;i++){const a=Math.random()*6.283,sp=140+Math.random()*(grand?560:400),rise=i%3===0;
  swFlies.push(rise?{x:Math.random()*swW,y:swH+20,vx:(Math.random()-.5)*80,vy:-(220+Math.random()*320),drag:.75,delay:Math.random()*1.4,life:0,max:2.8+Math.random()*2,sz:3+Math.random()*(grand?6:4),col:pal[i%pal.length],ph:Math.random()*6.28,fs:9+Math.random()*8,wob:Math.random()*6.28}
   :{x:cx+Math.cos(a)*24,y:cy+Math.sin(a)*16,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*.8-80,drag:.3,delay:Math.random()*.25,life:0,max:2.2+Math.random()*2.2,sz:2.5+Math.random()*(grand?7:5),col:pal[i%pal.length],ph:Math.random()*6.28,fs:9+Math.random()*8,wob:Math.random()*6.28})}
 if(!swFrame){swLast=0;swFrame=requestAnimationFrame(swTick)}}
function swTick(t){const dt=Math.min((t-(swLast||t))/1000,.05),d=Math.min(devicePixelRatio||1,2);swLast=t;swc.setTransform(d,0,0,d,0,0);swc.clearRect(0,0,swW,swH);
 swFlies=swFlies.filter(f=>{if(f.delay>0){f.delay-=dt;return true}f.life+=dt;if(f.life>f.max)return false;
  const k=Math.pow(f.drag,dt);f.vx=f.vx*k+Math.sin(f.life*3+f.wob)*70*dt;f.vy=f.vy*k-50*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;
  const s=f.sz;
  swc.setTransform(d,0,0,d,f.x*d,f.y*d);swc.rotate(Math.max(-.6,Math.min(.6,f.vx/400)));
  swc.globalAlpha=Math.min(1,f.life*5,(f.max-f.life)*1.6);swc.fillStyle=f.col;
  if(FX.wingFlap3D)flyPath(swc,0,0,s*1.2,f.life*f.fs/3.1416+f.ph/6.283);
  else{const flap=.2+.8*Math.abs(Math.sin(f.life*f.fs+f.ph));swc.beginPath();swc.moveTo(0,0);swc.bezierCurveTo(-s*2.3*flap,-s*2.6,-s*2.8*flap,-s*.1,0,0);swc.moveTo(0,0);swc.bezierCurveTo(-s*1.9*flap,s*.4,-s*1.2*flap,s*2,0,s*.3);
  swc.moveTo(0,0);swc.bezierCurveTo(s*2.3*flap,-s*2.6,s*2.8*flap,-s*.1,0,0);swc.moveTo(0,0);swc.bezierCurveTo(s*1.9*flap,s*.4,s*1.2*flap,s*2,0,s*.3)}
  swc.fill();return true});
 swc.globalAlpha=1;swc.setTransform(d,0,0,d,0,0);if(swFlies.length)swFrame=requestAnimationFrame(swTick);else{swFrame=0;swc.clearRect(0,0,swW,swH)}}
/* Game 1 · bug hunt: five caterpillar buttons, placed at random spots on every visit (one always inside a closed investigation). */
const pick=a=>a[Math.random()*a.length|0],shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);
const bugClosed=['#work details:nth-of-type(1) p:last-child','#work details:nth-of-type(2) p:last-child','#work details:nth-of-type(3) p:last-child','#work details:nth-of-type(4) p:last-child'];
const bugOpen=[{sel:'.hero',hero:true},{sel:'.expertise-strip',before:'a'},'#about .tags','#about .split>div:last-child>p','#journey .journey-heading>p','#serviceList .card p','#milestones .node p',(FX.scrollStory&&!reduced()&&innerWidth>=1000&&CSS.supports('animation-timeline: view()')?'.projgrid .proj:nth-child(-n+3) p:first-of-type':'.projgrid .proj p:first-of-type'),'#lab .arcade .subnote','#contact .availability+p','footer>span:first-child'];
const bugNeed=games.hunt.total-games.hunt.n,bugPlaces=bugNeed>0?[pick(bugClosed)]:[],bugZone=s=>{const h=document.querySelector(s.sel||s);return h&&h.closest('section,footer,.expertise-strip')},usedZones=new Set(bugPlaces.map(p=>bugZone(p)));
for(const s of shuffle(bugOpen)){if(bugPlaces.length>=bugNeed)break;const z=bugZone(s);if(z&&!usedZones.has(z)){usedZones.add(z);bugPlaces.push(s)}}
bugPlaces.forEach(s=>{const host=pick([...document.querySelectorAll(s.sel||s)]),b=document.createElement('button');b.className='hidebug';b.setAttribute('aria-label','A hidden bug. Click to catch it');
 if(s.hero){b.classList.add('hb-hero');b.style.left=(4+Math.random()*34)+'%';b.style.bottom=(22+Math.random()*40)+'px'}
 if(s.before)host.insertBefore(b,host.querySelector(s.before));else host.append(' ',b)});
document.querySelectorAll('.hidebug').forEach((b,i)=>{butterfly(b,'hb'+i+'-','#caterpillar-shape');b.addEventListener('click',()=>{if(b.classList.contains('caught'))return;b.classList.add('caught');b.setAttribute('aria-label','Bug caught. It transformed');const r=b.getBoundingClientRect();butterfly(b,'hbf'+i+'-');dust(r.left+13,r.top+6,'#4fe39a',12);score('hunt')})});
/* Contact highlights: perched butterflies on the resume and email cards scatter on hover and stream while you linger. */
const ctaCols=['#2fa96b','#4fe39a','#d9a93f','#e8c35a','#7fd8e8'],perchSpots=[['18%','-11px',-12],['60%','-12px',14],['calc(100% - 12px)','38%',78]];
document.querySelectorAll('.flycta').forEach((a,k)=>{butterfly(a.querySelector('.ctafly'),'cta'+k+'-');
 perchSpots.forEach(([l,tp,rt],j)=>{const p=document.createElement('i');p.className='pfly';p.setAttribute('aria-hidden','true');p.innerHTML=MICRO;p.style.cssText='left:'+l+';top:'+tp+';--rt:'+rt+'deg;--c:'+ctaCols[(k*2+j)%ctaCols.length]+';--d:'+(.35+k*.4+j*.2)+'s;--fx:'+((Math.random()-.3)*260)+'px;--fy:'+(-90-Math.random()*90)+'px;--sx:'+((j-1)*46+(Math.random()-.5)*20)+'px;--sy:'+(-44-Math.random()*40)+'px';a.append(p)});
 let stream=0;a.addEventListener('pointerenter',()=>{if(reduced())return;clearInterval(stream);stream=setInterval(()=>{const r=a.getBoundingClientRect();dust(r.left+18+Math.random()*(r.width-36),r.top+6+Math.random()*r.height*.4,ctaCols[Math.random()*ctaCols.length|0],1)},240)});
 a.addEventListener('pointerleave',()=>clearInterval(stream));
 a.addEventListener('click',()=>{const r=a.getBoundingClientRect();dust(r.left+r.width/2,r.top+r.height/2,'#4fe39a',16)})});
seen.observe($('.reach'));
document.querySelectorAll('.flylink').forEach(a=>{const f=document.createElement('i');f.className='lfly';f.setAttribute('aria-hidden','true');f.innerHTML=MICRO;a.prepend(f)});
questRender();matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',questRender);
scrollGuide();addEventListener('scroll',()=>{if(!document.documentElement.classList.contains('story'))scrollGuide()},{passive:true});document.querySelectorAll('details').forEach(el=>el.onpointerenter=()=>{const r=el.getBoundingClientRect();land(r.right-65,r.top-15)});
addEventListener('pointermove',e=>{if(guide.hidden||reduced())return;const r=guide.getBoundingClientRect();if(Math.hypot(e.clientX-r.x,e.clientY-r.y)<55)land(r.x-65,r.y-42)});
document.addEventListener('click',e=>{const b=e.target.closest('button,.btn');if(!b||reduced())return;const r=b.getBoundingClientRect(),f=document.createElement('span');f.className='spark';f.setAttribute('aria-hidden','true');f.textContent='✧';f.style.cssText='left:'+r.right+'px;top:'+r.top+'px;--x:-12px;--y:-15px';document.body.append(f);setTimeout(()=>f.textContent='✓',260);setTimeout(()=>f.remove(),900)});
function check(v){const expected=Number.isInteger(v)&&v>=1&&v<=10,actual=Number.isInteger(v)&&v>=($('#build').value==='fixed'?1:0)&&v<=10;return {pass:actual===expected,line:String(v)+' → expected '+(expected?'accept':'reject')+', observed '+(actual?'accept':'reject')}}
function execute(values){const tests=values.map(check),ok=tests.every(t=>t.pass);$('#result').textContent=(ok?'PASS':'DEFECT FOUND')+' · '+tests.filter(t=>t.pass).length+'/'+tests.length+' checks passed. '+tests.map(t=>t.line).join(' | ');const r=$('#result').getBoundingClientRect();land(r.right-45,r.top-25);dust(r.right-45,r.top,ok?'#57c994':'#bd85e9',12);$('#stage').textContent=ok?'🦋 Verified':'🐛 Reproduced · Select the patched build and retest.';
 /* Game 3 · defect lab: reproduce on the original build, then verify on the patched build with the failing value. */
 const build=$('#build').value;if(!ok&&build==='original'&&games.lab.n===0)score('lab');else if(ok&&build==='fixed'&&games.lab.n===1&&values.includes(0))score('lab')}
$('#run').onclick=()=>{if($('#qty').value===''){$('#result').textContent='Enter a quantity to run a test.';return}execute([Number($('#qty').value)])};$('#suite').onclick=()=>execute([-1,0,1,10,11,1.5]);
let phase=0, journeyTimer=0, journeyVisible=false, journeyPaused=false;
const stories=['A defect appears. First I isolate the smallest set of steps that makes it happen again.','Inside the chrysalis, a reproduction becomes a repeatable test. I isolate the failing condition and check the proposed fix.','The original scenario passes. I retest nearby boundaries and record the evidence the team needs for release.'];
function setPhase(next){phase=next;window.dispatchEvent(new CustomEvent('metamorphosis',{detail:phase}));$('.habitat').dataset.phase=phase;$('#story').textContent=stories[phase];document.querySelectorAll('.phase').forEach((b,i)=>{b.classList.toggle('active',i===phase);b.setAttribute('aria-pressed',i===phase)});$('.journey-progress i').style.width=((phase+1)/3*100)+'%';$('#advance').textContent=phase===2?'Replay the transformation ↻':'Next stage →'}
function scheduleJourney(){clearTimeout(journeyTimer);if(journeyVisible&&!journeyPaused&&!reduced()&&!document.hidden)journeyTimer=setTimeout(()=>{setPhase((phase+1)%3);scheduleJourney()},phase===2?6500:4000)}
$('#advance').onclick=()=>{setPhase((phase+1)%3);scheduleJourney()};
document.querySelectorAll('.phase').forEach(b=>b.onclick=()=>{setPhase(Number(b.dataset.step));scheduleJourney()});
$('#pauseJourney').onclick=()=>{journeyPaused=!journeyPaused;$('#pauseJourney').textContent=journeyPaused?'Resume animation':'Pause animation';$('#pauseJourney').setAttribute('aria-pressed',journeyPaused);$('.habitat').classList.toggle('paused',journeyPaused);scheduleJourney()};
new IntersectionObserver(([entry])=>{journeyVisible=entry.isIntersecting;scheduleJourney()},{threshold:.35}).observe($('.habitat'));
document.addEventListener('visibilitychange',scheduleJourney);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',scheduleJourney);
$('#brief').onsubmit=e=>{e.preventDefault();const body='QA enquiry (role or project)\n\nReply to: '+$('#email').value+'\n\n'+$('#need').value;const a=document.createElement('a');if(contactEmail){a.href='mailto:'+contactEmail+'?subject=QA%20enquiry&body='+encodeURIComponent(body)}else{a.href=URL.createObjectURL(new Blob([body],{type:'text/plain'}));a.download='QA-enquiry.txt'}a.click();if(!contactEmail)setTimeout(()=>URL.revokeObjectURL(a.href),2000);$('#contactResult').textContent=contactEmail?'Continue in your email application.':'Your note is ready to download and share. Nothing has been sent.'}
const scene=$('#intro'), flight=$('#flight'), ctx=flight.getContext('2d'), home=$('#home');
const flock=Array.from({length:2400},()=>({depth:Math.random(),twig:Math.random(),arc:Math.random(),jitter:Math.random()*6.28,delay:Math.random(),speed:.75+Math.random()*.65}));
let opening=false,visible=true,frame=0,last=0,clock=0,timer=0,w=1,h=1;
const shades=['#d0b3e0','#e7dba0','#efcfa6','#b0ccbc','#cab7f1','#f9eac9'];
function resizeSky(){w=flight.clientWidth;h=flight.clientHeight;const dpi=Math.min(devicePixelRatio,1.5);flight.width=Math.round(w*dpi);flight.height=Math.round(h*dpi);ctx.setTransform(dpi,0,0,dpi,0,0)}
function paint(now){frame=0;if(document.hidden||(!opening&&!visible)||reduced())return;
 if(now-last>=32){clock+=Math.min((now-last)/1000,.065);last=now;ctx.clearRect(0,0,w,h);
 const count=opening?(w<700?1250:2400):(w<700?65:190);
 for(let i=0;i<count;i++){const b=flock[i],age=opening?(clock-b.delay*2.8)*b.speed/4.2:(clock*.08*b.speed+b.delay)%1;if(age<0||age>1)continue;
 const sx=.84+.09*Math.cos(b.twig*8),sy=.38+.12*Math.sin(b.twig*8);
 const x=w*(sx-age*(.25+b.depth*.83)) + Math.sin(age*9+b.jitter)*age*28;
 const y=h*(sy+age*(b.arc-.56)*1.25-Math.sin(age*3.14)*(.09+.13*b.twig))+Math.sin(age*12+b.jitter)*age*16;
 const size=(.6+2.4*b.depth)*(opening?1:.85);
 ctx.fillStyle=shades[i%6];ctx.globalAlpha=Math.min(1,age*12, (1-age)*8)*(.35+b.depth*.59);
 if(FX.wingFlap3D)flyPath(ctx,x,y,size,clock*(5+b.depth*3)/3.1416+b.jitter/6.283);
 else{const flap=.16+.84*Math.abs(Math.sin(clock*(5+b.depth*3)+b.jitter));ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-size*2*flap,y-size*2,x-size*flap,y+size*.4);ctx.lineTo(x,y);ctx.quadraticCurveTo(x+size*2*flap,y-size*2,x+size*flap,y+size*.4)}
 ctx.fill()
 }ctx.globalAlpha=1}frame=requestAnimationFrame(paint)}
function resume(){if(!frame&&!reduced()){last=performance.now();frame=requestAnimationFrame(paint)}}
function finishScene(){clearTimeout(timer);opening=false;scene.classList.add('done');scene.inert=true;document.querySelectorAll('main,header,footer').forEach(el=>el.inert=false);home.prepend(flight);resizeSky();clock=1;resume();if(scene.contains(document.activeElement))$('.hero .actions a').focus({preventScroll:true});questHint()}
function startScene(){if(reduced()){finishScene();return}opening=true;clock=0;scene.inert=false;scene.classList.remove('done');scene.prepend(flight);document.querySelectorAll('main,header,footer').forEach(el=>el.inert=true);const shape=$('#introShape');shape.style.animation='none';void shape.offsetWidth;shape.style.animation='';resizeSky();resume();$('#skip').focus({preventScroll:true});timer=setTimeout(finishScene,5300)}
$('#skip').onclick=finishScene;document.addEventListener('keydown',e=>{if(opening&&e.key==='Escape')finishScene()});addEventListener('resize',resizeSky);document.addEventListener('visibilitychange',resume);new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)resume()}).observe(home);matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>{if(reduced()){finishScene();ctx.clearRect(0,0,w,h)}else resume()});startScene();
/* Organic flight: each ambient butterfly steers itself, banks into turns, never repeats. */
const drifts=[...document.querySelectorAll('.drift')].map((el,i)=>({el,seed:i*37+5,x:-1,y:0,a:Math.random()*.8-.4,turn:0,sp:26+i*12,sc:[1,.72,1.18][i]||1,flee:0}));
/* Game 2 · butterfly catch: click a wild drifter; it bolts off-screen and returns from the left a moment later. */
drifts.forEach(d=>d.el.addEventListener('click',()=>{if(d.flee>0||reduced())return;const r=d.el.getBoundingClientRect();dust(r.left+r.width/2,r.top+r.height/2,'#e9ffd4',14);d.flee=1.8;d.a=-.8-Math.random()*.6;d.el.classList.add('caught');score('catch')}));
let flyFrame=0,flyLast=0;
/* Keep-out: drifters fly around the hero label, headline and intro line, never across them (rect in hero coordinates, padded). */
let keep=null,keepAt=0;const keepEls=[$('.hero .wrap .label'),$('.hero h1'),$('.hero .wrap>p')];
function keepRect(t){if(t-keepAt<500&&keep)return keep;keepAt=t;const hr=home.getBoundingClientRect();let l=1e9,tp=1e9,r=-1e9,b=-1e9;
 for(const el of keepEls){if(!el)continue;const q=el.getBoundingClientRect();if(!q.width)continue;l=Math.min(l,q.left);tp=Math.min(tp,q.top);r=Math.max(r,q.right);b=Math.max(b,q.bottom)}
 keep=r>l?{l:l-hr.left-28,t:tp-hr.top-26,r:r-hr.left+28,b:b-hr.top+26}:null;return keep}
const freeY=(H,k,sz)=>{const lo=H*.12,hi=H*.72;for(let i=0;i<8;i++){const y=lo+(hi-lo)*Math.random();if(!k||y+sz<k.t||y>k.b)return y}return k&&k.b<H*.86?k.b+4:lo};
function flyLoop(t){flyFrame=0;if(reduced()||document.hidden||!visible){flyLast=0;return}
 const W=home.clientWidth,H=home.clientHeight,dt=Math.min((t-(flyLast||t))/1000,.05),k=keepRect(t);flyLast=t;
 for(const d of drifts){
  const dw=d.el.offsetWidth||60,dh=d.el.offsetHeight||50;
  if(d.x<-900){d.x=Math.random()*W;d.y=freeY(H,k,dh)}
  const fleeing=d.flee>0,boost=fleeing?7:1;
  if(fleeing){d.flee-=dt;if(d.flee<=0){d.x=-80;d.y=freeY(H,k,dh);d.a=Math.random()*.6-.3;d.el.classList.remove('caught')}}
  const steer=fleeing?0:(Math.sin(t/1400+d.seed)+.6*Math.sin(t/530+d.seed*2.7))*1.15*dt;
  d.a+=steer;d.turn+=(steer*900-d.turn)*.06;
  d.x+=Math.cos(d.a)*d.sp*boost*dt;d.y+=Math.sin(d.a)*d.sp*.55*boost*dt+Math.sin(t/900+d.seed)*7*dt;
  if(d.x>W+90){d.x=-80;d.y=freeY(H,k,dh);d.a=Math.random()*.6-.3}
  if(d.x<-100)d.x=W+80;
  if(!fleeing&&(d.y<H*.05||d.y>H*.86)){d.a=-d.a;d.y=Math.max(H*.05,Math.min(H*.86,d.y))}
  if(!fleeing&&k&&d.x+dw>k.l&&d.x<k.r&&d.y+dh>k.t&&d.y<k.b){
   /* inside the keep-out box: slide out over the top or under the bottom, whichever is nearer and in bounds */
   const up=(d.y+dh-k.t)<(k.b-d.y)&&k.t-dh>H*.05,dir=Math.cos(d.a)>=0?1:-1;
   let a=Math.atan2(Math.sin(d.a),Math.cos(d.a));const want=dir>0?(up?-.85:.85):(up?-Math.PI+.85:Math.PI-.85);
   a+=(want-a)*Math.min(1,dt*5);d.a=a;d.y+=(up?-1:1)*95*dt}
  d.el.style.transform='translate3d('+d.x+'px,'+d.y+'px,0) rotate('+Math.max(-26,Math.min(26,d.turn))+'deg) scale('+d.sc+')'}
 flyFrame=requestAnimationFrame(flyLoop)}
function flyStart(){if(!flyFrame&&!reduced()&&!document.hidden&&visible){flyLast=0;flyFrame=requestAnimationFrame(flyLoop)}}
new IntersectionObserver(([e])=>{if(e.isIntersecting)flyStart()}).observe(home);
document.addEventListener('visibilitychange',flyStart);flyStart();
/* Hero parallax: grove, flock and specimen drift at different depths. */
let px=0,py=0,parTick=0;const heroWrap=$('.hero .wrap');
function applyPar(){parTick=0;if(reduced())return;const sc=Math.min(scrollY,home.offsetHeight);
 home.style.setProperty('--bgx',px*16+'px');home.style.setProperty('--bgy',py*9-sc*.04+'px');
 hero.style.translate=(px*28)+'px '+(py*-20-sc*.08)+'px';
 heroWrap.style.translate='0 '+(sc*.13)+'px';
 flight.style.translate='0 '+(sc*.05)+'px'}
home.addEventListener('pointermove',e=>{const r=home.getBoundingClientRect();px=e.clientX/r.width-.5;py=(e.clientY-r.top)/r.height-.5;if(!parTick)parTick=requestAnimationFrame(applyPar)});
/* Pointer trail: small butterflies follow the mouse everywhere. */
let trailT=0,trailX=0,trailY=0;const trailShades=['#2fa96b','#4fe39a','#d9b23f','#9bd48a','#e9ffd4'];
document.addEventListener('pointermove',e=>{if(reduced()||!e.target.closest||!e.target.closest('.hero,#journey,#lab,#ai,#hood'))return;const now=performance.now();if(now-trailT>85&&Math.hypot(e.clientX-trailX,e.clientY-trailY)>22){trailT=now;trailX=e.clientX;trailY=e.clientY;dust(e.clientX+(Math.random()-.5)*16,e.clientY-8,trailShades[Math.random()*trailShades.length|0],1)}},{passive:true});
home.addEventListener('pointerleave',()=>{px=py=0;if(!parTick)parTick=requestAnimationFrame(applyPar)});
addEventListener('scroll',()=>{if(!parTick)parTick=requestAnimationFrame(applyPar)},{passive:true});

/* Scroll storytelling. Native scrolling is never intercepted: one passive scroll listener schedules one rAF; the frame
   reads scrollY/innerHeight only (geometry is cached on resize / content change) and writes transforms, opacities and
   custom properties. Everything here is off under prefers-reduced-motion (html.story is removed). */
(function(){
 const root=document.documentElement,main=document.querySelector('main');if(!main||!FX.scrollStory)return;
 /* Projects: the grid is wrapped in a pin + stage (DOM order of the cards is unchanged); CSS slides it when supported. */
 const grid=$('#projects .projgrid');let pin=null,stage=null;
 if(grid){pin=document.createElement('div');pin.className='pin';stage=document.createElement('div');stage.className='pin-stage';grid.before(pin);pin.append(stage);stage.append(grid)}
 const pinOK=()=>root.classList.contains('story')&&innerWidth>=1000&&CSS.supports('animation-timeline: view()');
 /* Guide companion: caterpillar -> cocoon -> butterfly, cross-faded by scroll position. */
 const gFly=document.createElement('span'),gLarva=document.createElement('span'),gCoc=document.createElement('span');
 gFly.className='g-stage g-fly';gLarva.className='g-stage g-larva';gCoc.className='g-stage g-cocoon';
 gFly.append(...guide.childNodes);butterfly(gLarva,'guidel-','#caterpillar-shape');
 gCoc.innerHTML='<svg viewBox="0 0 120 100" aria-hidden="true"><defs><linearGradient id="gcocG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef3bd"/><stop offset=".45" stop-color="#8fbf6a"/><stop offset="1" stop-color="#2f5a2a"/></linearGradient></defs><path d="M22 8H98" stroke="#5a4a2a" stroke-width="4" stroke-linecap="round"/><g class="coc-sway"><path d="M60 8V21" stroke="#d6eec2" stroke-width="1.6"/><path d="M60 20C74 22 80 40 76 60 73 76 66 90 60 94 54 90 47 76 44 60 40 40 46 22 60 20Z" fill="url(#gcocG)"/><path d="M53 33C57 46 56 66 60 85" stroke="#f7e8b0" stroke-width="1.6" fill="none" opacity=".7"/><circle cx="66" cy="40" r="2" fill="#e8c35a"/><circle cx="68" cy="53" r="1.6" fill="#e8c35a"/><circle cx="56" cy="29" r="1.4" fill="#e8c35a"/></g></svg>';
 guide.append(gLarva,gCoc,gFly);
 /* Background tone flow: two fixed colour layers cross-fade (opacity only) between the paper and sage section tones. */
 const toneA=document.createElement('div'),toneB=document.createElement('div');toneA.className=toneB.className='tone';toneA.setAttribute('aria-hidden','true');toneB.setAttribute('aria-hidden','true');document.body.prepend(toneA,toneB);
 const TONES={light:['#f5f5ed','#e9eddf'],dark:['#0d1d17','#132b22']},KEY={about:0,projects:1,milestones:0,journey:1,lab:0,ai:1,hood:0,services:1,contact:0};
 const bandKey=el=>el.classList.contains('expertise-strip')?1:el.id in KEY?KEY[el.id]:-1;
 const timeline=$('#careerHost'),nodes=timeline?[...timeline.querySelectorAll('.node')]:[];
 let geo=null,raf=0,g=-1,lastA=null,lastB=null,lastMix=-1,lastVine=-1,lastG=-1,wrTone=null,lastWr='';
 /* Wing reveal (wingreveal.js) panels below a light section must wear the tone that is really on screen there: the
    light sections are transparent, so the visible colour is tone A with tone B over it at `mix` (a plain sRGB mix). */
 const hexRgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),mixCol=(a,b,m)=>{const x=hexRgb(a),y=hexRgb(b);return 'rgb('+x.map((v,i)=>Math.round(v+(y[i]-v)*m)).join(', ')+')'};
 const docTop=el=>el.getBoundingClientRect().top+scrollY;
 function measure(){const vh=innerHeight;
  const bands=[...main.children].filter(el=>el.matches('section,.expertise-strip,.midband')).map(el=>{const t=docTop(el);return {t,b:t+el.offsetHeight,k:bandKey(el)}});
  const tl=timeline?{t:docTop(timeline),h:timeline.offsetHeight,n:nodes.map(n=>docTop(n))}:null;
  const pg=$('#playground'),ct=$('#contact');
  let pinx=0,stageh=0;if(pin&&pinOK()){pinx=Math.max(0,Math.round(grid.offsetWidth-stage.clientWidth+40));stageh=stage.offsetHeight}
  geo={vh,bands,tl,play:pg?docTop(pg):1e9,contact:ct?docTop(ct):1e9,pinTop:pin?docTop(pin):0,pinx,stageh};
  if(pin){const pt=Math.max(96,Math.round((vh-stageh)/2+30)),v=pinx+'px|'+stageh+'px|'+pt+'px';
   if(pin.dataset.v!==v){pin.dataset.v=v;pin.style.setProperty('--pinx',pinx+'px');pin.style.setProperty('--stageh',stageh+'px');pin.style.setProperty('--pt',pt+'px');geo.pt=pt}else geo.pt=pt}
  schedule()}
 const clamp=v=>v<0?0:v>1?1:v,ease=u=>{u=clamp(u);return u*u*(3-2*u)};
 function tick(){raf=0;if(!geo||!root.classList.contains('story'))return;const y=scrollY,vh=geo.vh;
  /* 1 · guide metamorphosis (eased toward the scroll target, so it trails the scroll a little) */
  const st=y<geo.contact-vh*1.05?ease((y-(geo.play-vh*.95))/(vh*.6)):1+ease((y-(geo.contact-vh*1.05))/(vh*.55));
  g=g<0?st:g+(st-g)*.14;if(Math.abs(st-g)<.002)g=st;
  if(Math.abs(g-lastG)>.004){lastG=g;const l=clamp(1-g),c=clamp(1-Math.abs(g-1)),f=clamp(g-1);
   gLarva.style.opacity=l.toFixed(3);gLarva.style.scale=(.7+.3*l).toFixed(3);gCoc.style.opacity=c.toFixed(3);gCoc.style.scale=(.75+.25*c).toFixed(3);gFly.style.opacity=f.toFixed(3);gFly.style.scale=(.55+.45*f).toFixed(3)}
  scrollGuideAt(geo.contact-y);
  /* 3a · career vine grows with the scroll; each entry lights up as the tip reaches it */
  if(geo.tl){const tip=y+vh*.62,p=clamp((tip-geo.tl.t)/geo.tl.h);if(Math.abs(p-lastVine)>.001){lastVine=p;timeline.style.setProperty('--vine',p.toFixed(4))}
   geo.tl.n.forEach((t,i)=>{const on=tip>=t+6;if(nodes[i].classList.contains('lit')!==on)nodes[i].classList.toggle('lit',on)})}
  /* 4 · section colour flow at the viewport centre: blend paper/sage across light-light boundaries */
  const cy=y+vh/2,Z=vh*.32,B=geo.bands;let i=B.findIndex(b=>cy>=b.t&&cy<b.b);if(i<0)i=cy<(B[0]?B[0].t:0)?0:B.length-1;
  let a=B[i]?B[i].k:0,b2=a,mix=0;
  if(B[i]){const nx=B[i+1],pv=B[i-1];
   if(nx&&cy>B[i].b-Z&&a>=0&&nx.k>=0){b2=nx.k;mix=ease((cy-(B[i].b-Z))/(2*Z))}
   else if(pv&&cy<B[i].t+Z&&a>=0&&pv.k>=0){b2=a;a=pv.k;mix=ease((cy-(B[i].t-Z))/(2*Z))}
   if(a<0){a=b2=(nx&&nx.k>=0?nx.k:pv&&pv.k>=0?pv.k:0);mix=0}}
  const pal=TONES[root.dataset.theme==='dark'?'dark':'light'],ca=pal[a],cb=pal[b2];
  if(ca!==lastA){lastA=ca;toneA.style.backgroundColor=ca}if(cb!==lastB){lastB=cb;toneB.style.backgroundColor=cb}
  if(Math.abs(mix-lastMix)>.003){lastMix=mix;toneB.style.opacity=mix.toFixed(3)}
  const wr=window.SK_wingReveal;if(wr){if(!wrTone)wrTone=wr.secs.filter(s=>{const pv=s.el.previousElementSibling;return pv&&bandKey(pv)>=0}).flatMap(s=>[s.L.d,s.R.d]);
   const col=mixCol(ca,cb,Math.round(lastMix*1000)/1000);if(col!==lastWr){lastWr=col;wrTone.forEach(d=>d.style.setProperty('--wr-prev',col))}}
  if(g!==st)schedule()}
 function schedule(){if(!raf)raf=requestAnimationFrame(tick)}
 /* Keyboard and screen readers: a focused project card in the pinned slide is scrolled to where the slide shows it. */
 if(grid)grid.addEventListener('focusin',e=>{if(!geo||!geo.pinx||!pinOK())return;const card=e.target.closest('.proj');if(!card)return;
  const x=Math.max(0,Math.min(geo.pinx,card.offsetLeft-(stage.clientWidth-card.offsetWidth)/2));scrollTo({top:geo.pinTop-geo.pt+x,behavior:'instant'})});
 function setStory(){const on=!reduced();root.classList.toggle('story',on);
  if(!on){if(wrTone)wrTone.forEach(d=>d.style.removeProperty('--wr-prev'));lastWr='';[gLarva,gCoc,gFly,toneA,toneB].forEach(el=>{el.style.opacity='';el.style.scale=''});timeline&&timeline.style.removeProperty('--vine');nodes.forEach(n=>n.classList.remove('lit'));lastG=lastVine=lastMix=-1;lastA=lastB=null}
  measure()}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);addEventListener('load',measure);
 if('ResizeObserver' in window){let rt=0;new ResizeObserver(()=>{clearTimeout(rt);rt=setTimeout(measure,120)}).observe(main)}
 new MutationObserver(()=>{lastA=lastB=null;schedule()}).observe(root,{attributes:true,attributeFilter:['data-theme']});
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',setStory);
 setStory()})();
