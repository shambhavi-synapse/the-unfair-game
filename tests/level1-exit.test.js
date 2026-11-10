import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {levels,chapters,badges,validateLevels} from '../src/levels.js';
import {updateShyDoor,bridgeActivated,stepRoller} from '../src/mechanics.js';

function harness(){
 const elements=new Map();
 function element(id){return {id,children:[],style:{},classList:{add(){},remove(){},toggle(){}},textContent:'',checked:true,dataset:{},
  append(...c){this.children.push(...c)},replaceChildren(){this.children=[]},setAttribute(){},addEventListener(){},
  getBoundingClientRect(){return {width:960,height:540}},getContext(){return new Proxy({},{get:()=>()=>{}})}
 }}
 const document={getElementById:id=>{if(!elements.has(id))elements.set(id,element(id));return elements.get(id)},
  querySelectorAll:()=>[],createElement:()=>element('new')};
 const window={addEventListener(){},visualViewport:{addEventListener(){}}};
 const localStorage={getItem:()=>JSON.stringify({unlocked:60,deaths:0}),setItem(){}};
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\s*$/gm,'');
 const instantiate=new Function('levels','chapters','badges','validateLevels','updateShyDoor','bridgeActivated','stepRoller',
  'document','window','localStorage','requestAnimationFrame','ResizeObserver','matchMedia','confirm',
  source+`;return {start,physics,setPlayer:(x,vx=0)=>{player.x=x;player.y=436;player.vx=vx;player.vy=0;player.grounded=true},
  setDoor:x=>{objects.door.x=x},
  activateSwitches:()=>objects.switches.forEach(sw=>sw.active=true),
  snapshot:()=>({finished,dead,doorX:objects.door.x,switches:objects.switches.map(sw=>sw.active),playerX:player.x,unlocked:save.unlocked})};`);
 return instantiate(levels,chapters,badges,validateLevels,updateShyDoor,bridgeActivated,stepRoller,
  document,window,localStorage,()=>{},undefined,()=>({matches:false}),()=>true);
}

test('Level 1 shy door never retreats across the final required jump',()=>{
 const g=harness();g.start(0);g.setPlayer(64);
 for(let i=0;i<1400;i++)g.physics(1/120);
 assert.ok(g.snapshot().doorX>=29*40);
 assert.equal(g.snapshot().finished,false);
});
test('Level 1 exit refuses premature overlap before gate and final crossing',()=>{
 const g=harness();g.start(0);
 // Force an exit overlap before the required geometry. It must not award completion.
 g.setDoor(80);g.setPlayer(80);g.physics(1/120);
 assert.equal(g.snapshot().finished,false);
 g.activateSwitches();g.setDoor(80);g.setPlayer(80);g.physics(1/120);
 assert.equal(g.snapshot().finished,false);
});
test('Level 1 win requires exit overlap, activated gate and completed crossing',()=>{
 const g=harness();g.start(0);
 const x=29*40+8;
 g.setPlayer(x);g.physics(1/120);
 assert.equal(g.snapshot().finished,false,'gate not yet opened');
 g.activateSwitches();g.setPlayer(x);g.physics(1/120);
 assert.equal(g.snapshot().finished,true);
 assert.equal(g.snapshot().unlocked,60,'existing progress cannot regress or jump');
});
test('Level 1 exit requirements remain stable on restart',()=>{
 const g=harness();g.start(0);g.activateSwitches();g.setPlayer(29*40+10);g.physics(1/120);
 assert.equal(g.snapshot().finished,true);
 g.start(0);assert.equal(g.snapshot().finished,false);
 assert.ok(g.snapshot().switches.every(active=>!active));
});
test('shy-door min bound does not alter older unconstrained mechanic use',()=>{
 const door={x:400,w:35},p={x:275,w:24,vx:0};
 const bounded=updateShyDoor(door,p,10,{minX:350,maxX:480});
 assert.equal(bounded.x,350);
 const unbounded=updateShyDoor(door,p,10,{maxX:480});
 assert.ok(unbounded.x<350);
});
