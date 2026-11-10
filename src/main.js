import {updateShyDoor,bridgeActivated,stepRoller} from './mechanics.js';
import {levels,chapters,badges,validateLevels} from './levels.js';
const $=id=>document.getElementById(id), C=$('canvas'),ctx=C.getContext('2d');
let W=960;const H=540, FLOOR=468, TILE=40, PX=24,PY=32, DT=1/120;
const storeKey='unfair-game-v1';
const load=()=>{try{const s=JSON.parse(localStorage.getItem(storeKey)||'{}');return {unlocked:Math.max(1,Math.min(levels.length,Number(s.unlocked)||1)),deaths:Math.max(0,Number(s.deaths)||0),sound:s.sound!==false,motion:s.motion!==false,commentary:s.commentary!==false,badges:Array.isArray(s.badges)?s.badges:[]}}catch{return {unlocked:1,deaths:0,sound:true,motion:true,commentary:true,badges:[]}}};
let lastGameplayRemarkAt=0;let lastRenderDelta=1/60;let save=load(),camera=0,deathAt=0,screen='menu',levelDeaths=0,levelIndex=0,previewMode=false,level=null,player=null,objects=null,t=0,dead=false,finished=false,paused=false,last=0,acc=0,toastUntil=0,toastText='',flash=0,shake=0;
const keys={left:false,right:false,jump:false};
let landscapeDismissed=false;
function updateLandscapeTip(){
 const phone=matchMedia('(pointer:coarse)').matches && Math.min(window.innerWidth,window.innerHeight)<700;
 const portrait=window.innerHeight>window.innerWidth;
 $('landscape-tip').classList.toggle('hidden',screen!=='game'||!phone||!portrait||landscapeDismissed);
}
$('dismiss-landscape').onclick=()=>{landscapeDismissed=true;updateLandscapeTip()};
$('go-landscape').onclick=async()=>{
 const element=$('game');
 try{if(element.requestFullscreen&&!document.fullscreenElement)await element.requestFullscreen()}catch{}
 try{if(window.screen?.orientation?.lock)await window.screen.orientation.lock('landscape')}catch{}
 updateLandscapeTip();
};
window.addEventListener('orientationchange',updateLandscapeTip);
window.addEventListener('resize',updateLandscapeTip);

// Canvas coordinates track the actual display aspect ratio. World tile dimensions never stretch.
function resizeGame(){
 const wrap=$('game-wrap');const bounds=wrap.getBoundingClientRect();
 if(!bounds.width||!bounds.height)return;
 const next=Math.max(290,Math.round(H*bounds.width/bounds.height));
 if(C.width!==next||C.height!==H){W=next;C.width=next;C.height=H;}
}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(resizeGame).observe($('game-wrap'));
window.addEventListener('resize',resizeGame);
window.visualViewport?.addEventListener('resize',resizeGame);

const persist=()=>{try{localStorage.setItem(storeKey,JSON.stringify(save))}catch{}};
const range=(x,y,w,h)=>({x,y,w,h});
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const sound=(frequency=300,duration=.06,type='sine')=>{if(!save.sound)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ac=sound.ac||(sound.ac=new AC());if(ac.state==='suspended')ac.resume();const osc=ac.createOscillator(),g=ac.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,ac.currentTime);osc.frequency.exponentialRampToValueAtTime(Math.max(50,frequency*.65),ac.currentTime+duration);g.gain.setValueAtTime(.07,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);osc.connect(g).connect(ac.destination);osc.start();osc.stop(ac.currentTime+duration)}catch{}};
function say(message,seconds=1.2){toastText=message;toastUntil=t+seconds;$('toast').textContent=message;$('toast').classList.add('show')}
function show(name){screen=name;for(const id of ['menu','levels','settings-screen','game','badges-screen','about-screen'])$(id).classList.toggle('hidden',id!==(name==='settings'?'settings-screen':name==='badges'?'badges-screen':name==='about'?'about-screen':name));if(name==='levels')renderLevels();if(name==='badges')renderBadges();updateLandscapeTip();if(name==='game'){$('sound').checked=save.sound;requestAnimationFrame(resizeGame);requestAnimationFrame(updateLandscapeTip)}else{for(const k of Object.keys(keys))keys[k]=false}}
function renderBadges(){const el=$('badges-grid');el.replaceChildren();for(const badge of badges){const earned=save.badges.includes(badge.after)||save.unlocked>badge.after;const item=document.createElement('article');item.className='badge-card'+(earned?'':' locked');const medal=document.createElement('div');medal.className='badge-medal';medal.textContent=earned?badge.mark:'?';const name=document.createElement('h3');name.textContent=earned?badge.name:'???';const caption=document.createElement('p');caption.textContent=earned?badge.line:`Complete Chapter ${badge.after/10} to reveal`;item.append(medal,name,caption);el.append(item)}}
let lastLockedRemarkAt=0, lockedRemarkCount=0;
function lockedDoorRemark(){
 const now=Date.now();
 if(now-lastLockedRemarkAt<3500)return;
 lastLockedRemarkAt=now;
 const lines=['Try the previous door.','Not on the list.','Your confidence is noted.'];
 const notice=$('locked-notice');
 notice.textContent=lines[Math.min(Math.floor(lockedRemarkCount/2),lines.length-1)];
 lockedRemarkCount++;
}
function renderLevels(){
 const el=$('chapters');el.replaceChildren();
 $('unlocked-counter').textContent=`${save.unlocked}/${levels.length} UNLOCKED`;
 $('locked-notice').textContent='';
 chapters.forEach(([label,diff],ch)=>{
  const wrap=document.createElement('section');wrap.className='chapter';
  const head=document.createElement('div');head.className='chapter-head';
  const heading=document.createElement('h3');heading.textContent=`${String(ch+1).padStart(2,'0')} · ${label}`;
  const subtitle=document.createElement('span');
  if(ch*10>=levels.length){subtitle.textContent='IN DEVELOPMENT'}
  else{const completed=Math.max(0,Math.min(10,save.unlocked-1-ch*10));subtitle.textContent=`${completed}/10 COMPLETE`}
  head.append(heading,subtitle);
  const tiles=document.createElement('div');tiles.className='tiles door-grid';
  if(ch*10>=levels.length){
   const p=document.createElement('p');p.className='chapter-unbuilt';p.textContent='More doors are being built. No shortcuts.';tiles.append(p)
  }else{
   for(let i=ch*10;i<Math.min((ch+1)*10,levels.length);i++){
    const locked=i+1>save.unlocked,completed=i+1<save.unlocked;
    const btn=document.createElement('button');
    btn.type='button';btn.className='level-door'+(completed?' done':locked?' locked':' next');
    btn.setAttribute('aria-label',`Level ${i+1}: ${levels[i].name}, ${locked?'locked':completed?'completed':'unlocked'}`);
    if(locked)btn.setAttribute('aria-disabled','true');
    const frame=document.createElement('span');frame.className='level-door-frame';
    const panel=document.createElement('span');panel.className='level-door-panel';
    const number=document.createElement('span');number.className='level-door-number';number.textContent=i+1;
    const knob=document.createElement('span');knob.className='level-door-knob';
    panel.append(number,knob);
    if(locked){const lock=document.createElement('span');lock.className='level-door-lock';lock.setAttribute('aria-hidden','true');lock.textContent='🔒';panel.append(lock)}
    if(completed){const done=document.createElement('span');done.className='level-door-complete';done.setAttribute('aria-hidden','true');done.textContent='✓';panel.append(done)}
    frame.append(panel);btn.append(frame);
    btn.addEventListener('click',()=>{if(locked)lockedDoorRemark();else start(i)});
    tiles.append(btn);
   }
  }
  wrap.append(head,tiles);el.append(wrap)
 });
}
const solid=(x,y,w,h,kind='floor',extra={})=>({x,y,w,h,kind,...extra});
function buildLevel(i){const def=levels[i];const gaps=def.gaps;const floors=[];for(let tile=0;tile<def.width;tile++){if(gaps.some(([a,b])=>tile>=a&&tile<b))continue;floors.push(solid(tile*TILE,FLOOR,TILE,H-FLOOR,'ground'))}
const crumble=def.crumble.map(n=>solid(n*TILE,FLOOR,TILE,H-FLOOR,'crumble',{timer:-1,fallen:false}));for(const c of crumble){const idx=floors.findIndex(f=>f.x===c.x);if(idx>=0)floors.splice(idx,1)}
const blink=def.blink.map((n,k)=>solid(n*TILE,FLOOR,TILE,H-FLOOR,'blink',{phase:(k%2)*.18}));for(const b of blink){const idx=floors.findIndex(f=>f.x===b.x);if(idx>=0)floors.splice(idx,1)}
const walls=def.walls.map(n=>solid(n*TILE,FLOOR-100,22,100,'wall',{opened:false}));
const switches=def.switches.map(([n,target])=>({x:n*TILE+6,y:FLOOR-15,w:26,h:15,target,active:false}));
const spikes=def.spikes.map(n=>range(n*TILE+8,FLOOR-22,24,22));
const fallers=def.fallers.map(n=>({x:n*TILE+2,y:40,w:36,h:35,startY:40,active:false,triggered:false,vy:0}));
const movers=def.movers.map(([a,b,speed])=>({x:a*TILE,y:FLOOR-58,w:80,h:13,min:a*TILE,max:b*TILE,dir:1,speed:speed*33,prevX:a*TILE}));
const fake=def.fake.map(n=>({x:n*TILE,y:FLOOR-62,w:35,h:62,used:false}));
const bridge=def.bridge?{...def.bridge,active:false,plate:{x:def.bridge.plate*TILE+5,y:FLOOR-15,w:30,h:15}}:null;
const roller=def.roller?{...def.roller,x:def.roller.spawn*TILE,y:FLOOR-40,w:40,h:40,speed:165,active:false,started:false,spent:false}:null;
const reverseZones=def.reverseZones.map(([a,z])=>({x:a*TILE,w:(z-a)*TILE}));
const portals=def.portals.map(([a,z])=>({x:a*TILE,y:FLOOR-65,w:34,h:65,dest:z*TILE}));
const fans=def.fans.map(([a,z,strength])=>({x:a*TILE,w:(z-a)*TILE,strength}));
const triggers=def.triggers.map(([kind,x,target])=>({kind,x:x*TILE,target:target*TILE,done:false,clock:0}));
return {floors,crumble,blink,walls,switches,spikes,fallers,movers,fake,triggers,door:range(def.exitTile!==null?def.exitTile*TILE:def.doorMode==='shy'?(def.width-7)*TILE:def.width*TILE-57,FLOOR-62,35,62),width:def.width*TILE,chaser:null,eventBridges:[],reverseZones,portals,fans,bridge,roller,doorMode:def.doorMode,doorMinX:def.exitRequiresTile!==null?def.exitRequiresTile*TILE:0,doorMaxX:def.width*TILE-45};
}
function start(i,retry=false,preview=false){const isPreview=retry?previewMode:preview;if(i<0||i>=levels.length||(!isPreview&&i+1>save.unlocked)||(isPreview&&(i<60||i>62)))return;if(!retry)previewMode=isPreview;levelIndex=i;level=levels[i];objects=buildLevel(i);player={x:64,y:FLOOR-PY,w:PX,h:PY,vx:0,vy:0,grounded:false,coyote:0,buffer:0,jumpHeld:false,face:1,squash:0,portalCooldown:0,reverseActive:false,reverseCleared:false};t=0;camera=0;deathAt=0;if(!retry)levelDeaths=0;acc=0;dead=false;finished=false;paused=false;flash=0;shake=0;toastUntil=0;$('toast').classList.remove('show');$('overlay').classList.add('hidden');$('chapter-name').textContent=`CHAPTER ${Math.floor(i/10)+1} · ${chapters[Math.floor(i/10)][0]}`;$('level-name').textContent=`${i+1}. ${level.name}`;updateDeaths();show('game');}
function updateDeaths(){$('death-counter').textContent=`☠ ${save.deaths}`}
function overlay(title,desc,buttons){$('overlay-title').textContent=title;$('overlay-desc').textContent=desc;const el=$('overlay-actions');el.replaceChildren();for(const [label,fn,primary] of buttons){const b=document.createElement('button');b.textContent=label;if(primary)b.className='primary';b.addEventListener('click',fn);el.append(b)}$('overlay').classList.remove('hidden')}
function die(){if(dead||finished)return;dead=true;deathAt=t;if(!previewMode){save.deaths++;persist();updateDeaths()}levelDeaths++;flash=.17;shake=save.motion?6:0;sound(170,.16,'sawtooth');const startDistance=player.x<160;const nearDoor=player.x>objects.door.x-180;const line=nearDoor&&levelDeaths===3?'So close.':startDistance&&levelDeaths===2?'Efficient.':levelDeaths===6?'Familiar territory.':null;
 if(line&&save.commentary!==false&&Date.now()-lastGameplayRemarkAt>12000){lastGameplayRemarkAt=Date.now();say(line,.8);}}
function win(){if(dead||finished)return;finished=true;sound(630,.17,'triangle');
 if(previewMode){
   const next=levelIndex+1;
   overlay('PREVIEW CLEARED.','Progress remains exactly where you left it.',
     [[next<=62?'NEXT NEW LEVEL →':'PLAY AGAIN',()=>start(next<=62?next:60,false,true),true],
      ['MAIN MENU',()=>show('menu'),false]]);
   return;
 }
 const complete=levelIndex+1;save.unlocked=Math.max(save.unlocked,Math.min(levels.length,complete+1));const earned=badges.find(b=>b.after===complete&&!save.badges.includes(b.after));if(earned)save.badges.push(earned.after);persist();if(earned){overlay(earned.name,earned.line,[[complete===levels.length?'LEVEL SELECT':'NEXT LEVEL →',()=>complete===levels.length?show('levels'):start(levelIndex+1),true],['BADGES',()=>show('badges'),false]])}else if(complete===levels.length){overlay('A TEMPORARY END.','More chapters are in development. The door can wait.',[['LEVEL SELECT',()=>show('levels'),true],['PLAY AGAIN',()=>start(0),false]])}else{overlay(complete%10===0?'CHAPTER COMPLETE.':'DOOR FOUND.',complete%10===0?'That was almost respectable.':levelDeaths===0?'Interesting.':levelDeaths>=6?'Eventually.':'Carry on.',[['NEXT LEVEL →',()=>start(levelIndex+1),true],['LEVEL SELECT',()=>show('levels'),false]])}}
function handleJump(pressed){if(pressed&&!keys.jump&&player)player.buffer=.12;keys.jump=pressed}
function physics(dt){if(!player||dead||finished||paused)return;t+=dt;const p=player,o=objects;
 p.buffer=Math.max(0,p.buffer-dt);p.coyote=p.grounded?.095:Math.max(0,p.coyote-dt);p.squash=Math.max(0,p.squash-dt);
 // Latch the inversion between its entry and exit; do not flip each frame on a seam.
 const pos=p.x+p.w/2;
 const zone=o.reverseZones[0];
 if(zone){
   if(pos<zone.x-40){p.reverseCleared=false;p.reverseActive=false}
   else if(pos>=zone.x+zone.w){p.reverseCleared=true;p.reverseActive=false}
   else if(pos>=zone.x&&!p.reverseCleared)p.reverseActive=true;
 }
 const reversed=p.reverseActive;
 const move=(Number(keys.right)-Number(keys.left))*(reversed?-1:1);
 p.portalCooldown=Math.max(0,p.portalCooldown-dt);
 const wind=o.fans.reduce((force,z)=>p.x+p.w/2>=z.x&&p.x+p.w/2<z.x+z.w?force+z.strength:force,0);
 p.vx=move*260+wind;
 if(move)p.face=move;
 if(p.buffer>0&&p.coyote>0){p.vy=-455;p.grounded=false;p.coyote=0;p.buffer=0;sound(410,.045)}
 if(!keys.jump&&p.vy< -150)p.vy+=1250*dt;
 p.vy=Math.min(740,p.vy+1190*dt);
 const activeBlink=b=>Math.sin(t*2.5*Math.PI+b.phase*Math.PI*2)>=-.3;
 for(const m of o.movers){m.prevX=m.x;m.x+=m.dir*m.speed*dt;if(m.x<m.min){m.x=m.min;m.dir=1}if(m.x>m.max){m.x=m.max;m.dir=-1}}
 if(o.doorMode==='shy')o.door=updateShyDoor(o.door,p,dt,{minX:o.doorMinX,maxX:o.doorMaxX});
 if(o.bridge&&!o.bridge.active&&bridgeActivated(o.bridge.plate,p)){o.bridge.active=true;sound(540,.08,'triangle');}
 if(o.roller){
   const ball=o.roller;
   if(!ball.started&&p.x>=ball.trigger*TILE){ball.started=true;ball.active=true;sound(115,.15,'sawtooth')}
   if(ball.active){const barrier=o.walls.find(w=>w.x===ball.barrier*TILE);const next=stepRoller(ball,dt,barrier);Object.assign(ball,next);if(ball.spent&&barrier){barrier.opened=true;sound(110,.17,'triangle')}}
   if(ball.active&&overlaps(p,ball))die();
 }
 const solids=()=>[...o.floors,...o.crumble.filter(c=>!c.fallen),...o.blink.filter(activeBlink),...o.movers,...o.walls.filter(w=>!w.opened),...o.eventBridges,...(o.bridge?.active?Array.from({length:o.bridge.to-o.bridge.from},(_,i)=>solid((o.bridge.from+i)*TILE,FLOOR,TILE,H-FLOOR,'bridge')):[])];
 p.x+=p.vx*dt;for(const s of solids())if(overlaps(p,s)){if(p.vx>0)p.x=s.x-p.w;else if(p.vx<0)p.x=s.x+s.w}p.x=Math.max(0,Math.min(o.width-p.w,p.x));
 const oldBottom=p.y+p.h;const beforeGrounded=p.grounded;p.grounded=false;p.y+=p.vy*dt;
 for(const s of solids())if(overlaps(p,s)){if(p.vy>=0&&oldBottom<=s.y+8){p.y=s.y-p.h;p.vy=0;p.grounded=true;if(!beforeGrounded)p.squash=.1;if(s.kind==='crumble'&&s.timer<0)s.timer=.43;if(s.kind===undefined&&o.movers.includes(s))p.x+=s.x-s.prevX}else if(p.vy<0){p.y=s.y+s.h;p.vy=0}else{if(p.x+p.w/2<s.x+s.w/2)p.x=s.x-p.w;else p.x=s.x+s.w}}
 for(const c of o.crumble)if(c.timer>=0&&!c.fallen){c.timer-=dt;if(c.timer<=0){c.fallen=true;sound(120,.07)}}
 if(p.portalCooldown===0)for(const gate of o.portals){if(overlaps(p,gate)){p.x=gate.dest;p.y=FLOOR-p.h;p.vx=0;p.vy=0;p.portalCooldown=.7;sound(620,.12,'triangle');break}}
 for(const sw of o.switches){if(!sw.active&&overlaps(p,sw)){sw.active=true;o.walls.filter(w=>w.x===sw.target*TILE).forEach(w=>w.opened=true);say('CLICK. SOMETHING MOVED.',1);sound(800,.1)}}
 for(const tr of o.triggers){if(!tr.done&&p.x>tr.x){tr.done=true;tr.clock=t;if(tr.kind==='collapse'){
 const first=Math.floor(tr.target/TILE);
 for(let n=first;n<first+2;n++){
  const idx=o.floors.findIndex(f=>f.x===n*TILE);
  if(idx>=0)o.floors.splice(idx,1);
  const existing=o.crumble.find(c=>c.x===n*TILE);
  if(existing){existing.timer=.4;existing.fallen=false}
  else o.crumble.push(solid(n*TILE,FLOOR,TILE,H-FLOOR,'crumble',{timer:.4,fallen:false}));
 }
 sound(190,.09,'triangle');
}
if(tr.kind==='bridge'){
 for(let n=0;n<2;n++)o.eventBridges.push(solid(tr.target+n*TILE,FLOOR,TILE,H-FLOOR,'giftBridge'));
 sound(560,.08,'triangle');
}
if(tr.kind==='rearGate'){
 o.walls.push(solid(tr.target,FLOOR-95,22,95,'wall',{opened:false}));
 sound(230,.1,'square');
}
if(tr.kind==='relocateDoor'){
 o.door.x=tr.target;
 sound(680,.1,'triangle');
 
}
if(tr.kind==='spike'){o.spikes.push({...range(tr.target+8,FLOOR-22,24,22),born:t+.22});void 0}if(tr.kind==='chase'){o.chaser={x:Math.max(0,p.x-125),y:FLOOR-28,w:24,h:28};void 0}if(tr.kind==='delay'){const f={x:tr.target+2,y:40,w:36,h:35,startY:40,active:true,triggered:true,vy:0};o.fallers.push(f);void 0}}}
 for(const f of o.fallers){if(!f.triggered&&Math.abs(p.x-f.x)<90){f.triggered=true;f.active=true;sound(130,.07)}if(f.active){f.vy=Math.min(520,f.vy+1100*dt);f.y=Math.min(FLOOR-f.h,f.y+f.vy*dt);if(overlaps(p,f))die()}}
 if(o.chaser){o.chaser.x+=115*dt;if(overlaps(p,o.chaser))die()}
 for(const sp of o.spikes)if((sp.born===undefined||t>=sp.born)&&overlaps(p,sp))die();
 for(const f of o.fake)if(!f.used&&overlaps(p,f)){f.used=true;if(level.fakeOpensGate){o.walls.forEach(w=>w.opened=true);say('WELL, THAT WORKED.',.8)}else if(save.commentary!==false)say('NOT THIS ONE.',.8);sound(170,.13)}
 if(p.y>H+10)die();const crossedRequiredTerrain=level.exitRequiresTile===null||p.x+p.w/2>=level.exitRequiresTile*TILE;
 const openedRequiredSwitches=!level.exitRequiresSwitches||o.switches.every(sw=>sw.active);
 if(crossedRequiredTerrain&&openedRequiredSwitches&&overlaps(p,o.door)&&(o.doorMode!=='shy'||Math.abs(p.vx)<15))win();
 }
function render(){if(screen!=='game'||!player)return;const p=player,o=objects,chapter=Math.floor(levelIndex/10),colors=['#2a3043','#2c3440','#353043','#2c3840','#34303c','#303344'];ctx.save();ctx.clearRect(0,0,W,H);ctx.fillStyle=colors[chapter]||colors[0];ctx.fillRect(0,0,W,H);
 const zoom=Math.max(1,Math.min(1.78,W/980));
 const visibleWidth=W/zoom;
 const goal=Math.max(0,Math.min(Math.max(0,o.width-visibleWidth),p.x-visibleWidth*.38));
 const follow=1-Math.exp(-10*Math.min(.05,Math.max(0,lastRenderDelta)));
 camera+= (goal-camera)*follow;
 ctx.translate(0,H*.87-FLOOR*zoom);
 ctx.scale(zoom,zoom);
 ctx.translate(-camera,0);ctx.fillStyle='#353a50';for(let n=0;n<=level.width;n++){const x=n*40;ctx.fillRect(x,0,1,540)}for(let n=0;n<14;n++)ctx.fillRect(0,n*40,o.width,1);
 const drawRect=(r,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(r.x),Math.round(r.y),r.w,r.h)};
 for(const f of o.floors){drawRect(f,'#606e7b');ctx.fillStyle='#9aa8ad';ctx.fillRect(f.x,f.y,40,5)}
 for(const b of o.blink){const on=Math.sin(t*2.5*Math.PI+b.phase*Math.PI*2)>=-.3;ctx.globalAlpha=on?1:.17;drawRect(b,'#b7a4e0');ctx.fillStyle='#e2d5ff';ctx.fillRect(b.x,b.y,40,5);ctx.globalAlpha=1}
 for(const c of o.crumble){if(c.fallen)continue;drawRect(c,c.timer>=0?'#a8765f':'#826d6c');ctx.fillStyle='#d6b4a2';ctx.fillRect(c.x,c.y,40,5);if(c.timer>=0){ctx.strokeStyle='#352f3e';ctx.beginPath();ctx.moveTo(c.x+10,c.y+8);ctx.lineTo(c.x+24,c.y+20);ctx.lineTo(c.x+30,c.y+27);ctx.stroke()}}
 if(o.bridge){const b=o.bridge;drawRect(b.plate,b.active?'#86d6b0':'#f1c66e');for(let i=b.from;i<b.to;i++){ctx.globalAlpha=b.active?1:.3;drawRect({x:i*TILE,y:FLOOR,w:TILE,h:6},b.active?'#8fd4b8':'#6a7a8d');ctx.globalAlpha=1}}
 if(o.roller&&o.roller.started){const r=o.roller;ctx.save();ctx.fillStyle=r.spent?'#8a847e':'#d99976';ctx.beginPath();ctx.arc(r.x+r.w/2,r.y+r.h/2,r.w/2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f6c7a7';ctx.lineWidth=4;ctx.stroke();ctx.restore();}
 for(const platform of o.eventBridges){drawRect(platform,'#87bdae');ctx.fillStyle='#c7eadc';ctx.fillRect(platform.x,platform.y,platform.w,5)}
 for(const m of o.movers){drawRect(m,'#e5bd74');ctx.fillStyle='#fff0ba';ctx.fillRect(m.x,m.y,m.w,4)}
 for(const z of o.reverseZones){ctx.fillStyle='#555273';ctx.fillRect(z.x,FLOOR+7,z.w,7)}
 for(const z of o.fans){ctx.fillStyle='#8fcbd3';for(let x=z.x+18;x<z.x+z.w;x+=85){ctx.save();ctx.translate(x,FLOOR-16);ctx.rotate(t*8);ctx.fillRect(-3,-15,6,30);ctx.fillRect(-15,-3,30,6);ctx.restore()}}
 for(const gate of o.portals){ctx.fillStyle='#a68fd2';ctx.fillRect(gate.x,gate.y,gate.w,gate.h);ctx.fillStyle='#323648';ctx.fillRect(gate.x+5,gate.y+5,gate.w-10,gate.h-5)}
 for(const wall of o.walls)if(!wall.opened){
 drawRect(wall,'#aa6867');ctx.strokeStyle='#f9a89c';ctx.strokeRect(wall.x+3,wall.y+3,wall.w-6,wall.h-6);
 if(o.roller&&wall.x===o.roller.barrier*TILE){
   ctx.fillStyle='#f4d5a5';ctx.font='bold 14px Fredoka, sans-serif';
   ctx.fillText('◉',wall.x+4,wall.y-12);
   ctx.strokeStyle='#f4d5a5';ctx.beginPath();ctx.moveTo(wall.x+7,wall.y+7);ctx.lineTo(wall.x+16,wall.y+7);ctx.stroke();
 }
}
 for(const sw of o.switches){drawRect(sw,sw.active?'#86d6b0':'#e8c36c');ctx.fillStyle='#393a4c';ctx.fillRect(sw.x+6,sw.y+4,14,6)}
 for(const s of o.spikes){if(s.born!==undefined&&t<s.born)continue;ctx.fillStyle='#fb817b';ctx.beginPath();ctx.moveTo(s.x,FLOOR);ctx.lineTo(s.x+s.w/2,s.y);ctx.lineTo(s.x+s.w,FLOOR);ctx.closePath();ctx.fill()}
 for(const f of o.fallers){if(!f.triggered)continue;drawRect(f,'#d97970');ctx.fillStyle='#f9b2a0';ctx.fillRect(f.x+4,f.y+f.h-5,f.w-8,4);if(!f.triggered){ctx.strokeStyle='#d97970';ctx.beginPath();ctx.moveTo(f.x+f.w/2,0);ctx.lineTo(f.x+f.w/2,f.y);ctx.stroke()}}
 if(o.chaser)drawRect(o.chaser,'#ef9770');
 const drawDoor=d=>{drawRect(d,'#eee8d9');drawRect({x:d.x+6,y:d.y+7,w:d.w-12,h:d.h-7},'#323648');ctx.fillStyle='#e6c86c';ctx.fillRect(d.x+d.w-11,d.y+33,4,5);ctx.strokeStyle='#f9f3e6';ctx.strokeRect(d.x-3,d.y-3,d.w+6,d.h+3)};for(const f of o.fake)drawDoor(f);
 drawDoor(o.door);
 if(!dead){ctx.save();ctx.translate(p.x+p.w/2,p.y+p.h/2);ctx.scale(1+(p.squash>0?.13:0),1-(p.squash>0?.12:0));ctx.fillStyle='#f1c76e';ctx.beginPath();ctx.roundRect(-12,-16,24,32,7);ctx.fill();ctx.fillStyle='#252536';ctx.fillRect(p.face>0?1:-7,-5,4,5);ctx.fillRect(p.face>0?7:-1,-5,4,5);ctx.restore()}
 if(flash>0){ctx.restore();ctx.save();ctx.fillStyle=`rgba(255,110,100,${Math.min(.35,flash*2)})`;ctx.fillRect(0,0,W,H)}ctx.restore();}
function frame(time){let elapsed=Math.min(.05,(time-last)/1000||0);lastRenderDelta=elapsed;last=time;if(screen==='game'&&!paused){if(dead){flash=Math.max(0,flash-elapsed);t+=elapsed;if(t-deathAt>.38)start(levelIndex,true)}else if(!finished){acc+=elapsed;let steps=0;while(acc>=DT&&steps++<8){physics(DT);acc-=DT}}if(t>toastUntil)$('toast').classList.remove('show')}render();requestAnimationFrame(frame)}
function pause(){if(screen!=='game'||finished||dead)return;paused=!paused;if(paused)overlay('PAUSED','The traps are taking a break.',[['RESUME',()=>{$('overlay').classList.add('hidden');paused=false},true],['RESTART',()=>start(levelIndex)],['MENU',()=>show('menu')]]);else $('overlay').classList.add('hidden')}
$('play').onclick=()=>start(Math.max(0,save.unlocked-1));$('preview').onclick=()=>start(60,false,true);$('select').onclick=()=>show('levels');$('settings').onclick=()=>show('settings');$('badges').onclick=()=>show('badges');$('about').onclick=()=>show('about');document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>show('menu'));
$('home').onclick=()=>{paused=true;overlay('LEAVE LEVEL?','Your unlocked levels are saved.',[['CONTINUE',()=>{paused=false;$('overlay').classList.add('hidden')},true],['MAIN MENU',()=>show('menu')]])};$('restart').onclick=()=>start(levelIndex);$('pause').onclick=pause;
$('sound').checked=save.sound;$('motion').checked=save.motion;$('commentary').checked=save.commentary;$('sound').onchange=e=>{save.sound=e.target.checked;persist()};$('motion').onchange=e=>{save.motion=e.target.checked;persist()};$('commentary').onchange=e=>{save.commentary=e.target.checked;persist()};$('reset').onclick=()=>{if(confirm('Erase all unlocked levels and death count? This cannot be undone.')){save.unlocked=1;save.deaths=0;save.badges=[];persist();show('menu')}};
const keyNames={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',KeyW:'jump',ArrowUp:'jump'};
window.addEventListener('keydown',e=>{if(screen!=='game')return;if(keyNames[e.code]){e.preventDefault();if(keyNames[e.code]==='jump')handleJump(true);else keys[keyNames[e.code]]=true}if(e.code==='KeyR'&&!e.repeat)start(levelIndex);if(e.code==='Escape'&&!e.repeat)pause()});
window.addEventListener('keyup',e=>{if(keyNames[e.code]){e.preventDefault();if(keyNames[e.code]==='jump')handleJump(false);else keys[keyNames[e.code]]=false}});
window.addEventListener('blur',()=>{for(const k of Object.keys(keys))keys[k]=false;if(screen==='game'&&!paused&&!finished&&!dead)pause()});
for(const b of document.querySelectorAll('[data-control]')){const which=b.dataset.control;const down=e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);if(which==='jump')handleJump(true);else keys[which]=true};const up=e=>{e.preventDefault();if(which==='jump')handleJump(false);else keys[which]=false};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up)}
const errors=validateLevels();if(errors.length)console.error('Level validation failed',errors);show('menu');resizeGame();requestAnimationFrame(frame);