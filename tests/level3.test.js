import test from 'node:test';
import assert from 'node:assert/strict';
import {levels} from '../src/levels.js';
import {stepRoller} from '../src/mechanics.js';

test('Level 3 has an observable roller-operated barrier with stable floor',()=>{
 const l=levels[2],r=l.roller;
 assert.equal(l.name,'The Floor Is Fine');
 assert.ok(r,'roller exists');
 assert.ok(l.walls.includes(r.barrier),'gate exists');
 assert.ok(r.spawn<r.trigger&&r.trigger<r.barrier,'pursuer begins behind player');
 assert.ok(!l.gaps.some(([a,b])=>a<r.barrier&&b>r.spawn),'roller track continuous');
 assert.ok(!l.blink.some(t=>t>=r.barrier-3&&t<=r.barrier),'waiting area cannot vanish');
 assert.ok(!l.crumble.some(t=>t>=r.barrier-3&&t<=r.barrier),'waiting area cannot collapse');
});

test('Level 3 timed route activates roller, opens barrier and reaches exit',()=>{
 // Deterministic fixed-timestep movement model with engine horizontal motion,
 // gravity/jump constants and roller-gate collision. Not a full browser playtest.
 const l=levels[2],dt=1/120,gate={x:l.roller.barrier*40,w:22,opened:false};
 const floor=468,spikes=new Set(l.spikes);
 let player={x:64,y:436,w:24,h:32,vx:0,vy:0,grounded:false,coyote:0};
 let ball={x:l.roller.spawn*40,y:428,w:40,h:40,speed:165,active:false,started:false,spent:false};
 let jumped=false,ballStarted=false,gateOpened=false,completed=false,dead=false;
 const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
 for(let i=0;i<1400;i++){
  const t=i*dt;
  // Continue to gate, wait and jump the approaching ball, then jump over final spike.
  const run=t<4.47||t>6.7;
  const jump=(t>=5.23&&t<5.49)||(t>=7.0&&t<7.18);
  player.vx=run?260:0;
  player.coyote=player.grounded?.095:Math.max(0,player.coyote-dt);
  if(jump&&!jumped&&player.coyote>0){player.vy=-455;player.grounded=false;player.coyote=0}
  if(!jump&&player.vy<-150)player.vy+=1250*dt;
  jumped=jump;player.vy=Math.min(740,player.vy+1190*dt);
  if(!ball.started&&player.x>=l.roller.trigger*40){ball.started=true;ball.active=true;ballStarted=true}
  if(ball.active){
   ball=stepRoller(ball,dt,gate);
   if(ball.spent){gate.opened=true;gateOpened=true}
  }
  if(ball.active&&overlap(player,ball)){dead=true;break}
  player.x+=player.vx*dt;
  if(!gate.opened&&player.x+player.w>gate.x&&player.x<gate.x+gate.w){player.x=gate.x-player.w}
  const oldBottom=player.y+player.h;
  player.grounded=false;player.y+=player.vy*dt;
  if(player.y+player.h>=floor&&oldBottom<=floor+8){player.y=floor-player.h;player.vy=0;player.grounded=true}
  for(const n of spikes){
   const hazard={x:n*40+8,y:floor-22,w:24,h:22};
   if(overlap(player,hazard)){dead=true;break}
  }
  if(dead)break;
  if(player.x+player.w>l.width*40-57){completed=true;break}
 }
 assert.ok(ballStarted,'roll triggered');
 assert.ok(gateOpened,'ball broke barrier');
 assert.equal(dead,false,'player survived the modeled route');
 assert.ok(completed,'player reached exit');
});
