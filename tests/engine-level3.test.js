import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {levels,chapters,badges,validateLevels} from '../src/levels.js';
import {updateShyDoor,bridgeActivated,stepRoller} from '../src/mechanics.js';

function mountGame(){
 const elements=new Map();
 const makeElement=id=>({
   id,style:{},classList:{add(){},remove(){},toggle(){}},
   dataset:{},textContent:'',checked:true,addEventListener(){},
   append(){},replaceChildren(){},setAttribute(){},
   getBoundingClientRect(){return {width:960,height:540}},
   getContext(){return new Proxy({},{get:()=>()=>{}})}
 });
 const document={
   getElementById(id){
     if(!elements.has(id))elements.set(id,makeElement(id));
     return elements.get(id);
   },querySelectorAll(){return []},createElement(){return makeElement('created')}
 };
 const window={addEventListener(){},visualViewport:{addEventListener(){}}};
 const localStorage={getItem(){return JSON.stringify({unlocked:3,deaths:0})},setItem(){}};
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8')
   .replace(/^import .*;\s*$/gm,'');
 const instantiate=new Function('levels','chapters','badges','validateLevels',
   'updateShyDoor','bridgeActivated','stepRoller','document','window',
   'localStorage','requestAnimationFrame','ResizeObserver','matchMedia','confirm',
   source+`;return {start,physics,keys,handleJump,snapshot:()=>({
       x:player.x,y:player.y,dead,finished,
       roller:{...objects.roller},gate:{...objects.walls[0]}
   })};`);
 return instantiate(levels,chapters,badges,validateLevels,
   updateShyDoor,bridgeActivated,stepRoller,document,window,localStorage,
   ()=>{},undefined,()=>({matches:false}),()=>true);
}
test('Level 3: complete scripted route through real game physics and moving gate',()=>{
 const game=mountGame();
 game.start(2);
 let started=false,opened=false,completed=false;
 for(let step=0;step<1700;step++){
   const t=step/120;
   game.keys.right=t<4.47||t>6.7;
   const jumping=(t>=1.82&&t<2.05)||(t>=5.23&&t<5.49)||(t>=7&&t<7.18);
   game.handleJump(jumping);
   game.physics(1/120);
   const state=game.snapshot();
   started ||=state.roller.started;
   opened ||=state.gate.opened;
   assert.equal(state.dead,false,`died at t=${t.toFixed(2)}, x=${state.x.toFixed(1)}`);
   if(state.finished){completed=true;break}
 }
 assert.ok(started,'ball must activate');
 assert.ok(opened,'ball must break gate');
 assert.ok(completed,'player must reach and enter door');
});
