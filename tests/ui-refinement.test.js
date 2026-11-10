import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {levels,chapters,badges,validateLevels} from '../src/levels.js';
import {updateShyDoor,bridgeActivated,stepRoller} from '../src/mechanics.js';

function uiGame(){
 const elements=new Map();
 const make=id=>{
  const el={id,children:[],attributes:{},textContent:'',style:{},checked:true,
    classList:{add(){},remove(){},toggle(){}},dataset:{},
    append(...children){this.children.push(...children)},replaceChildren(){this.children=[]},
    setAttribute(k,v){this.attributes[k]=v},addEventListener(k,fn){this[k]=fn},
    getBoundingClientRect(){return {width:960,height:540}},
    getContext(){return new Proxy({},{get:()=>()=>{}})}
  };return el;
 };
 const document={getElementById:id=>{
  if(!elements.has(id))elements.set(id,make(id));return elements.get(id)
 },querySelectorAll:()=>[],createElement:()=>make('created')};
 let writes=0;
 const localStorage={getItem:()=>JSON.stringify({unlocked:3,deaths:0}),setItem(){writes++}};
 const window={addEventListener(){},visualViewport:{addEventListener(){}}};
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\s*$/gm,'');
 const init=new Function('levels','chapters','badges','validateLevels','updateShyDoor',
  'bridgeActivated','stepRoller','document','window','localStorage',
  'requestAnimationFrame','ResizeObserver','matchMedia','confirm',
  source+`;return {renderLevels,show,start,lockedDoorRemark,save,
    getWrites:()=>localStorage._writes||0};`);
 return {ui:init(levels,chapters,badges,validateLevels,updateShyDoor,bridgeActivated,stepRoller,
    document,window,localStorage,()=>{},undefined,()=>({matches:false}),()=>true),
   elements,writeCount:()=>writes};
}
test('level selection has five door controls per row on phones and 60 doors in six groups',()=>{
 const {ui,elements}=uiGame();ui.renderLevels();
 const groups=elements.get('chapters').children;
 assert.equal(groups.length,15);
 assert.equal(groups.slice(0,6).reduce((n,g)=>n+g.children[1].children.length,0),60);
 assert.equal(groups.slice(6).filter(g=>g.children[1].children.length===0).length,9);
 const first=groups[0].children[1].children;
 assert.match(first[0].className,/level-door/);
 assert.match(first[2].className,/next/);
 assert.match(first[3].className,/locked/);
 assert.equal(first[3].attributes['aria-disabled'],'true');
 assert.ok(first[3].attributes['aria-label'].includes('locked'));
});
test('locked level taps give feedback but never mutate progress or start gameplay',()=>{
 const {ui,elements,writeCount}=uiGame();ui.renderLevels();
 const locked=elements.get('chapters').children[0].children[1].children[3];
 const before=JSON.stringify(ui.save);
 locked.click();
 assert.equal(JSON.stringify(ui.save),before);
 assert.equal(writeCount(),0);
 assert.match(elements.get('locked-notice').textContent,/previous door|list|confidence/i);
});
test('upper tagline is absent; original subtitle and menus survive',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.doesNotMatch(html,/A VERY REASONABLE PLATFORMER/);
 assert.match(html,/The door is right there\. Probably\./);
 assert.match(html,/id="locked-notice"/);
 for(const id of ['play','select','badges','settings','about'])assert.match(html,new RegExp('id="'+id+'"'));
});
test('commentary cannot delay automatic respawn',()=>{
 const code=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(code,/deathAt=t/);
 assert.match(code,/t-deathAt>\.38/);
 assert.doesNotMatch(code,/if\(t>toastUntil\+\.1\)start/);
});
