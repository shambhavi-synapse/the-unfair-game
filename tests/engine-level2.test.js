import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {levels,chapters,badges,validateLevels} from '../src/levels.js';
import {updateShyDoor,bridgeActivated,stepRoller} from '../src/mechanics.js';

function harness(){
 const elements=new Map();
 const el=id=>({id,style:{},textContent:'',checked:true,classList:{add(){},remove(){},toggle(){}},
 dataset:{},append(){},replaceChildren(){},setAttribute(){},addEventListener(){},
 getBoundingClientRect(){return {width:960,height:540}},getContext(){return new Proxy({},{get:()=>()=>{}})}});
 const document={getElementById:id=>{if(!elements.has(id))elements.set(id,el(id));return elements.get(id)},
  querySelectorAll:()=>[],createElement:()=>el('new')};
 const window={addEventListener(){},visualViewport:{addEventListener(){}}};
 const localStorage={getItem:()=>JSON.stringify({unlocked:2,sound:false,commentary:false}),setItem(){}};
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\s*$/gm,'');
 const build=new Function('levels','chapters','badges','validateLevels','updateShyDoor','bridgeActivated','stepRoller',
  'document','window','localStorage','requestAnimationFrame','ResizeObserver','matchMedia','confirm',
  source+`;return {start,physics,keys,handleJump,snap:()=>({
  x:player.x,grounded:player.grounded,dead,finished,bridgeActive:objects.bridge?.active
  })};`);
 return build(levels,chapters,badges,validateLevels,updateShyDoor,bridgeActivated,stepRoller,
  document,window,localStorage,()=>{},undefined,()=>({matches:false}),()=>true);
}

test('Level 2: solve first gap, plate bridge, spike and final gap through actual engine',()=>{
 const g=harness();g.start(1);const dt=1/120,hold=.26;
 let phase=0,holdUntil=0,bridgeActive=false,lastGapCleared=false,won=false;
 for(let step=0;step<2500;step++){
  const time=step*dt,z=g.snap();
  assert.equal(z.dead,false,`Death at ${time.toFixed(2)} sec, x=${z.x.toFixed(1)}`);
  bridgeActive ||=z.bridgeActive;
  if(z.finished){won=true;break}
  if(phase===0&&z.x>=270&&z.grounded){phase=1;holdUntil=time+hold}
  if(phase===1&&z.x>490&&z.grounded&&time>holdUntil+.1){phase=2}
  if(phase===2&&z.x>=1050&&z.grounded){phase=3;holdUntil=time+hold}
  if(phase===3&&z.x>1200&&z.grounded&&time>holdUntil+.1){phase=4}
  if(phase===4&&z.x>=1300&&z.grounded){phase=5;holdUntil=time+hold}
  if(phase===5&&z.x>1480&&z.grounded&&time>holdUntil+.1){phase=6;lastGapCleared=true}
  g.keys.right=true;
  g.handleJump([1,3,5].includes(phase)&&time<holdUntil);
  g.physics(dt);
 }
 assert.ok(bridgeActive,'Pressure plate must open the missing bridge');
 assert.ok(lastGapCleared,'Final gap must be crossed before exit');
 assert.ok(won,'Recorded input must complete Level 2');
});
