import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('official Doorodo artwork is local, vector and contains mascot and door',()=>{
 for(const name of ['doorodo-logo.svg','doorodo-favicon.svg','doorodo-app-icon.svg','doorodo-about.svg']){
  const svg=load('assets/'+name);
  assert.match(svg,/<svg\s[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg,/<\/svg>\s*$/);
  assert.doesNotMatch(svg,/<(script|image|foreignObject)\b/i);
 }
 const logo=load('assets/doorodo-logo.svg');
 assert.match(logo,/yellow rounded character|yellow character/i);
 assert.match(logo,/closed door/i);
});
test('home wordmark retains typography with a miniature character punctuation',()=>{
 const html=load('index.html');
 assert.match(html,/DOOR<em>ODO<\/em>/);
 assert.match(html,/class="mascot-period"/);
 assert.doesNotMatch(html,/class="dot">\./);
 assert.match(html,/doorodo-logo\.svg/);
 assert.match(html,/doorodo-favicon\.svg/);
});
test('About explains the mascot and preserves creator credit',()=>{
 const html=load('index.html');
 assert.match(html,/Meet Doorodo\./);
 assert.match(html,/every reason not to trust a door/);
 assert.match(html,/Shambhavi/);
 assert.match(html,/doorodo-about\.svg/);
});
test('fullscreen orientation is requested only through a supported browser object',()=>{
 const code=load('src/main.js');
 assert.match(code,/window\.screen\?\.orientation\?\.lock/);
 assert.doesNotMatch(code,/if\(screen\.orientation\?\.lock\)/);
});
