import test from 'node:test';import assert from 'node:assert/strict';import {levels,chapters,validateLevels} from '../src/levels.js';
test('60 existing scripted levels and 15 planned chapters',()=>{assert.equal(levels.length,60);assert.equal(chapters.length,15)});
test('level definitions are structurally valid',()=>assert.deepEqual(validateLevels(),[]));
test('all titles are distinct',()=>assert.equal(new Set(levels.map(x=>x.name)).size,60));
test('each level has a walkable starting area and exit',()=>{for(const [i,l] of levels.entries()){assert.ok(!l.gaps.some(([a,b])=>a<=1&&b>1),`spawn missing ${i+1}`);assert.ok(!l.gaps.some(([a,b])=>a<=l.width-2&&b>l.width-2),`exit missing ${i+1}`)}});
test('switches lead to valid target walls',()=>{for(const [i,l] of levels.entries())for(const [,wall] of l.switches)assert.ok(l.walls.includes(wall),`switch target missing ${i+1}`)});
test('distinct mechanic combinations across levels',()=>{const signatures=levels.map(l=>[l.gaps,l.spikes,l.crumble,l.blink,l.movers,l.switches,l.fallers,l.triggers,l.fake].map(a=>a.length).join(':'));assert.ok(new Set(signatures).size>=35)});
test('scrolling levels have sensible width and exit ground',()=>{for(const [i,l] of levels.entries()){assert.ok(l.width>=24,`invalid width ${i+1}`);assert.ok(!l.gaps.some(([a,b])=>a<=l.width-2&&b>l.width-2),`exit gap ${i+1}`)}});
test('badge thresholds match the intended chapters',async()=>{const {badges}=await import('../src/levels.js');assert.deepEqual(badges.map(b=>b.after),[30,60,90,120,150]);assert.equal(new Set(badges.map(b=>b.name)).size,5)});

test('new collapse triggers use safe deterministic target coordinates',()=>{const planned=levels.slice(0,10).flatMap((l,i)=>l.triggers.filter(t=>t[0]==='collapse').map(t=>({l,i,t})));assert.equal(planned.length,3);for(const {l,i,t} of planned){assert.ok(t[1]<t[2],`level ${i+1}: collapse has no reaction distance`);assert.ok(t[2]+1<l.width-2,`level ${i+1}: collapse outside level`)}});
test('all finalized chapter names remain unchanged',()=>assert.deepEqual(chapters.map(c=>c[0]),['A Simple Beginning','Minor Inconveniences','Nothing to See Here','Working as Intended','Please Proceed','A Matter of Timing','Trust the Process','Perfectly Safe','The Usual Route','Almost Finished','Further Instructions','Nothing Personal','One Last Thing','Final Preparations','The Exit']));

test('first three levels use distinct environment puzzles',()=>{
 assert.equal(levels[0].doorMode,'shy');
 assert.deepEqual(levels[1].bridge,{from:20,to:23,plate:17});
 assert.deepEqual(levels[2].roller,{trigger:14,spawn:10,barrier:31});
 assert.ok(levels[2].walls.includes(31));
 assert.ok(levels[0].width>24&&levels[1].width>24&&levels[2].width>24);
});
