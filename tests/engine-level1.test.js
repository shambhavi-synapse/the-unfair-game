import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {levels,chapters,badges,validateLevels} from '../src/levels.js';
import {updateShyDoor,bridgeActivated,stepRoller} from '../src/mechanics.js';

function mount(){
 const elements=new Map();
 const element=id=>({id,style:{},textContent:'',checked:true,classList:{add(){},remove(){},toggle(){}},
  dataset:{},append(){},replaceChildren(){},setAttribute(){},addEventListener(){},
  getBoundingClientRect(){return {width:960,height:540}},
  getContext(){return new Proxy({},{get:()=>()=>{}})}
 });
 const document={getElementById:id=>{
  if(!elements.has(id))elements.set(id,element(id));return elements.get(id)
 },querySelectorAll:()=>[],createElement:()=>element('created')};
 const window={addEventListener(){},visualViewport:{addEventListener(){}}};
 const localStorage={getItem:()=>JSON.stringify({unlocked:1,deaths:0,sound:false,commentary:false}),setItem(){}};
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\s*$/gm,'');
 const factory=new Function('levels','chapters','badges','validateLevels','updateShyDoor',
  'bridgeActivated','stepRoller','document','window','localStorage',
  'requestAnimationFrame','ResizeObserver','matchMedia','confirm',
  source+`;return {start,physics,keys,handleJump,snapshot:()=>({
   x:player.x,grounded:player.grounded,dead,finished,t,
   doorX:objects.door.x,switchActive:objects.switches.every(sw=>sw.active)
  })};`);
 return factory(levels,chapters,badges,validateLevels,updateShyDoor,bridgeActivated,stepRoller,
  document,window,localStorage,()=>{},undefined,()=>({matches:false}),()=>true);
}

test('Level 1: fully complete the actual game engine route without skipping final gap or gate',()=>{
 const g=mount();g.start(0);
 const dt=1/120,hold=.26;
 let stage=0,holdUntil=0,switched=false,finalGapCrossed=false,completed=false;
 const stages=[];
 for(let step=0;step<2800;step++){
  const time=step*dt,z=g.snapshot();
  assert.equal(z.dead,false,`Death at ${time.toFixed(2)} sec, x=${z.x.toFixed(1)}`);
  if(z.finished){completed=true;break}
  if(stage===0&&z.x>=455&&z.grounded){stage=1;holdUntil=time+hold;stages.push('gap 1')}
  if(stage===1&&z.x>640&&z.grounded&&time>holdUntil+.1){stage=2;stages.push('land 1')}
  if(stage===2&&z.x>=695&&z.grounded){stage=3;holdUntil=time+hold;stages.push('collapse crossing')}
  if(stage===3&&z.x>840&&z.grounded&&time>holdUntil+.1){stage=4;stages.push('land 2')}
  if(stage===4&&z.switchActive){stage=5;switched=true;stages.push('gate switch')}
  if(stage===5&&z.x>=1030&&z.grounded){stage=6;holdUntil=time+hold;stages.push('final gap')}
  if(stage===6&&z.x>1160&&z.grounded&&time>holdUntil+.1){stage=7;finalGapCrossed=true;stages.push('final landing')}
  g.keys.right=[0,1,2,3,5,6].includes(stage);
  g.keys.left=stage===4&&!z.switchActive&&z.x>840;
  g.handleJump([1,3,6].includes(stage)&&time<holdUntil);
  g.physics(dt);
 }
 assert.ok(switched,'Required wall switch activated');
 assert.ok(finalGapCrossed,'Final gap physically crossed');
 assert.ok(completed,'Correct shy door entered');
 assert.ok(stages.includes('gap 1')&&stages.includes('final gap'));
});
