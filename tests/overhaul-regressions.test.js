import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {levels,validateLevels} from '../src/levels.js';

test('all 63 level definitions remain structurally valid',()=>{
 assert.equal(levels.length,63);
 assert.deepEqual(validateLevels(),[]);
});
test('real exits do not always follow every fake exit',()=>{
 const withDecoys=levels.filter(l=>l.fake.length);
 assert.ok(withDecoys.length>=10);
 const before=withDecoys.filter(l=>l.exitTile!==null&&l.fake.some(tile=>tile>l.exitTile));
 assert.ok(before.length>=2,'some real exits must appear before a decoy');
});
test('fake door can be a useful puzzle interaction',()=>{
 const level=levels[26];
 assert.equal(level.name,'The Fake Shortcut');
 assert.equal(level.fakeOpensGate,true);
 assert.ok(level.fake.length>0&&level.walls.length>0);
});
test('camera has no artificial fog overlay and uses natural viewport zoom',()=>{
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.doesNotMatch(main,/const revealX|createLinearGradient\(revealX|fog\.addColorStop/);
 assert.match(main,/visibleWidth=W\/zoom/);
 assert.match(main,/ctx\.translate\(-camera,0\)/);
});
test('real and decoy doors share one identical renderer',()=>{
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(main,/const drawDoor=d=>/);
 assert.match(main,/for\(const f of o\.fake\)drawDoor\(f\)/);
 assert.match(main,/drawDoor\(o\.door\)/);
});
test('landscape touch controls are docked outside game canvas',()=>{
 const css=readFileSync(new URL('../style.css',import.meta.url),'utf8');
 assert.match(css,/#mobile\{position:relative;inset:auto/);
 assert.match(css,/justify-content:center;line-height:1;padding:0/);
});
