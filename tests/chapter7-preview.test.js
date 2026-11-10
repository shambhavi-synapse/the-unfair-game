import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {levels,chapters,badges,validateLevels} from '../src/levels.js';
import {updateShyDoor,bridgeActivated,stepRoller} from '../src/mechanics.js';

function game(){
 const elements=new Map();
 const element=id=>({id,style:{},textContent:'',checked:true,classList:{add(){},remove(){},toggle(){}},dataset:{},
 append(){},replaceChildren(){},setAttribute(){},addEventListener(){},
 getBoundingClientRect(){return {width:960,height:540}},getContext(){return new Proxy({},{get:()=>()=>{}})}});
 const document={getElementById:id=>{if(!elements.has(id))elements.set(id,element(id));return elements.get(id)},
 querySelectorAll:()=>[],createElement:()=>element('new')};
 const window={addEventListener(){},visualViewport:{addEventListener(){}}};
 let writes=0;
 const localStorage={getItem:()=>JSON.stringify({unlocked:1,deaths:0,sound:false,commentary:false,badges:[]}),setItem(){writes++}};
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\s*$/gm,'');
 const factory=new Function('levels','chapters','badges','validateLevels','updateShyDoor','bridgeActivated','stepRoller',
 'document','window','localStorage','requestAnimationFrame','ResizeObserver','matchMedia','confirm',
 source+`;return {start,physics,keys,win,die,setPlayerAtDoor:()=>{player.x=objects.door.x;player.y=436;player.vy=0},
 snapshot:()=>({previewMode,levelIndex,unlocked:save.unlocked,deaths:save.deaths,badges:[...save.badges],finished,dead}),getWrites:()=>localStorage._writes||0};`);
 const g=factory(levels,chapters,badges,validateLevels,updateShyDoor,bridgeActivated,stepRoller,
 document,window,localStorage,()=>{},undefined,()=>({matches:false}),()=>true);
 return {g,writes:()=>writes};
}
test('preview unlocks only three new playable stages without changing persistent level unlock',()=>{
 const {g,writes}=game();
 g.start(60);
 assert.equal(g.snapshot().previewMode,false);
 assert.notEqual(g.snapshot().levelIndex,60,'normal progression must remain locked');
 g.start(60,false,true);
 assert.equal(g.snapshot().levelIndex,60);
 assert.equal(g.snapshot().previewMode,true);
 assert.equal(g.snapshot().unlocked,1);
 assert.equal(writes(),0);
});
test('preview victory never awards chapters, badges or progress',()=>{
 const {g,writes}=game();
 g.start(60,false,true);
 g.setPlayerAtDoor();g.physics(1/120);
 assert.equal(g.snapshot().finished,true);
 assert.equal(g.snapshot().unlocked,1);
 assert.deepEqual(g.snapshot().badges,[]);
 assert.equal(writes(),0);
});
test('preview restart keeps preview access; normal play exits preview mode',()=>{
 const {g}=game();
 g.start(61,false,true);
 g.start(61,true);
 assert.equal(g.snapshot().levelIndex,61);
 assert.equal(g.snapshot().previewMode,true);
 g.start(0);
 assert.equal(g.snapshot().levelIndex,0);
 assert.equal(g.snapshot().previewMode,false);
});
test('preview deaths do not overwrite saved death statistics',()=>{
 const {g,writes}=game();
 g.start(62,false,true);g.die();
 assert.equal(g.snapshot().deaths,0);
 assert.equal(g.snapshot().dead,true);
 assert.equal(writes(),0);
});
