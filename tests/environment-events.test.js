import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {levels,chapters,badges,validateLevels} from '../src/levels.js';
import {updateShyDoor,bridgeActivated,stepRoller} from '../src/mechanics.js';

function mount(){
 const nodes=new Map();
 const elem=id=>({id,style:{},classList:{add(){},remove(){},toggle(){}},dataset:{},
   addEventListener(){},append(){},replaceChildren(){},setAttribute(){},
   getBoundingClientRect(){return {width:960,height:540}},
   getContext(){return new Proxy({},{get:()=>()=>{}})}
 });
 const document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,elem(id));return nodes.get(id)},
   querySelectorAll:()=>[],createElement:()=>elem('created')};
 const window={addEventListener(){},visualViewport:{addEventListener(){}}};
 const localStorage={getItem:()=>JSON.stringify({unlocked:60}),setItem(){}};
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\s*$/gm,'');
 const factory=new Function('levels','chapters','badges','validateLevels',
   'updateShyDoor','bridgeActivated','stepRoller','document','window',
   'localStorage','requestAnimationFrame','ResizeObserver','matchMedia','confirm',
   source+`;return {start,physics,keys,setPlayer:(x)=>{player.x=x;player.y=436;player.vy=0;player.grounded=true},
   snapshot:()=>({triggers:objects.triggers.map(t=>({...t})),bridges:objects.eventBridges.map(b=>({...b})),
   walls:objects.walls.map(w=>({...w})),door:{...objects.door},dead})};`);
 return factory(levels,chapters,badges,validateLevels,updateShyDoor,bridgeActivated,stepRoller,
   document,window,localStorage,()=>{},undefined,()=>({matches:false}),()=>true);
}
test('helpful bridge appears after crossing its event and resets on restart',()=>{
 const game=mount();game.start(15);
 const event=levels[15].triggers.find(([kind])=>kind==='bridge');
 assert.ok(event);
 game.setPlayer(event[1]*40+1);game.physics(1/120);
 let state=game.snapshot();
 assert.ok(state.bridges.length===2);
 assert.equal(state.bridges[0].x,event[2]*40);
 game.physics(1/120);assert.equal(game.snapshot().bridges.length,2,'fires once');
 game.start(15);assert.equal(game.snapshot().bridges.length,0,'reset removes bridge');
});
test('relocating door event changes the real exit only after activation',()=>{
 const game=mount();game.start(47);
 const event=levels[47].triggers.find(([kind])=>kind==='relocateDoor');
 assert.ok(event);const original=game.snapshot().door.x;
 game.setPlayer(event[1]*40+1);game.physics(1/120);
 assert.equal(game.snapshot().door.x,event[2]*40);
 assert.notEqual(game.snapshot().door.x,original);
 game.start(47);assert.equal(game.snapshot().door.x,original);
});
test('rear gate appears behind player and resets',()=>{
 const game=mount();game.start(33);const event=levels[33].triggers.find(([kind])=>kind==='rearGate');
 assert.ok(event);const original=game.snapshot().walls.length;
 game.setPlayer(event[1]*40+1);game.physics(1/120);
 assert.equal(game.snapshot().walls.length,original+1);
 assert.equal(game.snapshot().walls.at(-1).x,event[2]*40);
 game.start(33);assert.equal(game.snapshot().walls.length,original);
});
test('event metadata uses valid triggers and the original count is unchanged',()=>{
 assert.equal(levels.length,63);
 assert.deepEqual(validateLevels(),[]);
 for(const l of levels)for(const t of l.triggers)
   assert.ok(['collapse','spike','chase','delay','bridge','rearGate','relocateDoor'].includes(t[0]));
});
