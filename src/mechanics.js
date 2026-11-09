// Mechanic state transitions. Pure logic makes behaviour reproducible and testable.
export function updateShyDoor(door, player, dt, limits) {
  const next={...door};
  const center=player.x+player.w/2;
  const approaching=player.vx>25 && player.x+player.w>door.x-155;
  if(approaching && door.x<limits.maxX) next.x=Math.min(limits.maxX,door.x+180*dt);
  else if(Math.abs(player.vx)<15 && door.x>center+36) next.x=Math.max(center+36,door.x-130*dt);
  return next;
}
export function bridgeActivated(plate, player) {
  return player.x+player.w>plate.x&&player.x<plate.x+plate.w&&
    player.y+player.h>plate.y&&player.y<plate.y+plate.h;
}
export function stepRoller(roller, dt, barrier) {
  if(!roller.active)return {...roller};
  const next={...roller,x:roller.x+roller.speed*dt};
  if(barrier&&!barrier.opened&&next.x+next.w>=barrier.x){
    next.x=barrier.x-next.w;next.active=false;next.spent=true;
  }
  return next;
}
