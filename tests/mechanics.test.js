import test from 'node:test';import assert from 'node:assert/strict';
import {updateShyDoor,bridgeActivated,stepRoller} from '../src/mechanics.js';
test('shy door retreats while approached and returns when the player waits',()=>{const door={x:400,w:35},runner={x:275,w:24,vx:260},waiting={x:275,w:24,vx:0};const retreat=updateShyDoor(door,runner,0.1,{maxX:480});assert.ok(retreat.x>400);const approach=updateShyDoor(retreat,waiting,0.1,{maxX:480});assert.ok(approach.x<retreat.x)});
test('shy door respects world boundary',()=>{const moved=updateShyDoor({x:470,w:35},{x:400,w:24,vx:260},1,{maxX:480});assert.equal(moved.x,480)});
test('bridge activates only when player touches the plate',()=>{const plate={x:300,y:453,w:30,h:15};assert.equal(bridgeActivated(plate,{x:150,y:436,w:24,h:32}),false);assert.equal(bridgeActivated(plate,{x:307,y:436,w:24,h:32}),true)});
test('roller breaks a closed barrier deterministically',()=>{const r={x:100,w:40,active:true,speed:165};const b={x:160,opened:false};const stopped=stepRoller(r,.2,b);assert.equal(stopped.x,120);assert.equal(stopped.spent,true);assert.equal(stopped.active,false)});

test('shy door can ultimately overlap a stopped player',()=>{
 let door={x:400,w:35};const waiting={x:275,w:24,vx:0};
 for(let frame=0;frame<180;frame++)door=updateShyDoor(door,waiting,1/60,{maxX:480});
 assert.ok(door.x<waiting.x+waiting.w,'door must reach the player rather than stall out of range');
});
test('no roller movement occurs before activation or after barrier impact',()=>{
 const initial={x:100,w:40,active:false,speed:165};
 assert.deepEqual(stepRoller(initial,.5,null),initial);
 const stopped=stepRoller({...initial,active:true},.5,{x:160,opened:false});
 assert.equal(stopped.active,false);
 assert.equal(stepRoller(stopped,.5,{x:160,opened:false}).x,stopped.x);
});
