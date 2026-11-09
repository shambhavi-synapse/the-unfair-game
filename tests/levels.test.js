import test from 'node:test';import assert from 'node:assert/strict';import {levels,chapters,validateLevels} from '../src/levels.js';
test('60 existing scripted levels and 15 planned chapters',()=>{assert.equal(levels.length,60);assert.equal(chapters.length,15)});
test('level definitions are structurally valid',()=>assert.deepEqual(validateLevels(),[]));
test('all titles are distinct',()=>assert.equal(new Set(levels.map(x=>x.name)).size,60));
test('each level has a walkable starting area and exit',()=>{for(const [i,l] of levels.entries()){assert.ok(!l.gaps.some(([a,b])=>a<=1&&b>1),`spawn missing ${i+1}`);assert.ok(!l.gaps.some(([a,b])=>a<=23&&b>23),`exit missing ${i+1}`)}});
test('switches lead to valid target walls',()=>{for(const [i,l] of levels.entries())for(const [,wall] of l.switches)assert.ok(l.walls.includes(wall),`switch target missing ${i+1}`)});
test('distinct mechanic combinations across levels',()=>{const signatures=levels.map(l=>[l.gaps,l.spikes,l.crumble,l.blink,l.movers,l.switches,l.fallers,l.triggers,l.fake].map(a=>a.length).join(':'));assert.ok(new Set(signatures).size>=35)});
test('scrolling levels have sensible width and exit ground',()=>{for(const [i,l] of levels.entries()){assert.ok(l.width>=24,`invalid width ${i+1}`);assert.ok(!l.gaps.some(([a,b])=>a<=l.width-2&&b>l.width-2),`exit gap ${i+1}`)}});
test('badge thresholds match the intended chapters',async()=>{const {badges}=await import('../src/levels.js');assert.deepEqual(badges.map(b=>b.after),[30,60,90,120,150]);assert.equal(new Set(badges.map(b=>b.name)).size,5)});
