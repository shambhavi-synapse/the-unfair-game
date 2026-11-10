import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {levels,chapters,badges,validateLevels} from '../src/levels.js';
import {updateShyDoor,bridgeActivated,stepRoller} from '../src/mechanics.js';

function mount(index){
 const nodes=new Map();
 const element=id=>({id,style:{},checked:true,textContent:'',dataset:{},
 classList:{add(){},remove(){},toggle(){}},append(){},replaceChildren(){},
 setAttribute(){},addEventListener(){},getBoundingClientRect(){return {width:960,height:540}},
 getContext(){return new Proxy({},{get:()=>()=>{}})}});
 const document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,element(id));return nodes.get(id)},
 querySelectorAll:()=>[],createElement:()=>element('new')};
 const window={addEventListener(){},visualViewport:{addEventListener(){}}};
 const localStorage={getItem:()=>JSON.stringify({unlocked:63,sound:false,commentary:false}),setItem(){}};
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\s*$/gm,'');
 const factory=new Function('levels','chapters','badges','validateLevels','updateShyDoor','bridgeActivated','stepRoller',
 'document','window','localStorage','requestAnimationFrame','ResizeObserver','matchMedia','confirm',
 source+`;return {start,physics,keys,handleJump,snap:()=>({
 x:player.x,grounded:player.grounded,dead,finished,reversed:player.reverseActive,
 reversedCleared:player.reverseCleared,portalCooldown:player.portalCooldown
 })};`);
 const g=factory(levels,chapters,badges,validateLevels,updateShyDoor,bridgeActivated,stepRoller,
 document,window,localStorage,()=>{},undefined,()=>({matches:false}),()=>true);
 g.start(index);return g;
}
function simulate(index,steer,maxSteps=2200){
 const game=mount(index);const dt=1/120;
 let sawInversion=false,sawNormalAfterInversion=false,sawPortal=false,sawFan=false,sawLastGap=false;
 let jumpUntil=0,stage=0;
 for(let i=0;i<maxSteps;i++){
  const t=i*dt,z=game.snap();
  assert.equal(z.dead,false,`Level ${index+1} failed at t=${t.toFixed(2)}, x=${z.x.toFixed(1)}`);
  if(z.finished)return {finished:true,sawInversion,sawNormalAfterInversion,sawPortal,sawFan,sawLastGap};
  if(index===60){
   if(z.reversed)sawInversion=true;
   if(sawInversion&&z.reversedCleared&&!z.reversed)sawNormalAfterInversion=true;
   if(stage===0&&z.x>=680&&z.grounded){stage=1;jumpUntil=t+.3}
   if(stage===1&&z.x>880&&z.grounded&&t>jumpUntil+.1){stage=2;sawLastGap=true}
   if(stage===2&&z.x>=910&&z.grounded){stage=3;jumpUntil=t+.3}
   game.keys.right=!z.reversed;game.keys.left=z.reversed;
   game.handleJump((stage===1||stage===3)&&t<jumpUntil);
  }else if(index===61){
   if(z.portalCooldown>0)sawPortal=true;
   if(stage===0&&z.x>=980&&z.grounded){stage=1;jumpUntil=t+.27}
   game.keys.right=true;game.keys.left=false;
   game.handleJump(stage===1&&t<jumpUntil);
  }else{
   if(z.x>=320&&z.x<840)sawFan=true;
   if(stage===0&&z.x>=510&&z.grounded){stage=1;jumpUntil=t+.27}
   if(z.x>810&&z.grounded)sawLastGap=true;
   if(stage===1&&z.x>=935&&z.grounded&&t>jumpUntil+.1){stage=2;jumpUntil=t+.27}
   if(stage===2&&z.x>=1150&&z.grounded&&t>jumpUntil+.1){stage=3;jumpUntil=t+.27}
   game.keys.right=true;game.keys.left=false;
   game.handleJump([1,2,3].includes(stage)&&t<jumpUntil);
  }
  game.physics(dt);
 }
 return {finished:false,sawInversion,sawNormalAfterInversion,sawPortal,sawFan,sawLastGap};
}
test('Level 61: reversed controls crossed and genuine exit reached',()=>{
 const result=simulate(60);
 assert.equal(result.finished,true);
 assert.equal(result.sawInversion,true);
 assert.equal(result.sawNormalAfterInversion,true);
 assert.equal(result.sawLastGap,true);
});
test('Level 62: portal jumps physically unjumpable gap, then reaches true exit',()=>{
 const level=levels[61];
 assert.ok(level.gaps.some(([a,b])=>b-a>=7));
 const result=simulate(61);
 assert.equal(result.finished,true);
 assert.equal(result.sawPortal,true);
});
test('Level 63: wind-assisted long gap and two spikes with real physics',()=>{
 const result=simulate(62);
 assert.equal(result.finished,true);
 assert.equal(result.sawFan,true);
 assert.equal(result.sawLastGap,true);
});
test('new mechanics reset correctly on replay',()=>{
 const game=mount(61);
 game.keys.right=true;for(let i=0;i<240;i++)game.physics(1/120);
 assert.ok(game.snap().portalCooldown>=0);
 game.start(61);
 assert.equal(game.snap().portalCooldown,0);
});
