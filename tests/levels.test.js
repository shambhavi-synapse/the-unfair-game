import test from 'node:test';import assert from 'node:assert/strict';import {levels,chapters,validateLevels} from '../src/levels.js';
test('exactly 60 levels in six chapters',()=>{assert.equal(levels.length,60);assert.equal(chapters.length,6)});
test('level definitions are structurally valid',()=>assert.deepEqual(validateLevels(),[]));
test('all titles are distinct',()=>assert.equal(new Set(levels.map(x=>x.name)).size,60));
test('each level has a walkable starting area and exit',()=>{for(const [i,l] of levels.entries()){assert.ok(!l.gaps.some(([a,b])=>a<=1&&b>1),`spawn missing ${i+1}`);assert.ok(!l.gaps.some(([a,b])=>a<=23&&b>23),`exit missing ${i+1}`)}});
test('switches lead to valid target walls',()=>{for(const [i,l] of levels.entries())for(const [,wall] of l.switches)assert.ok(l.walls.includes(wall),`switch target missing ${i+1}`)});
test('distinct mechanic combinations across levels',()=>{const signatures=levels.map(l=>[l.gaps,l.spikes,l.crumble,l.blink,l.movers,l.switches,l.fallers,l.triggers,l.fake].map(a=>a.length).join(':'));assert.ok(new Set(signatures).size>=35)});