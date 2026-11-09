// Hand-authored level scripts. Coordinates are 40px tiles, world 24 x 13.5 tiles.
// Grammar: gaps [start,end], hazards [tile], trigger scripts [kind,tile,...].
export const chapters=[
 ['FALSE CONFIDENCE','Beginner'],['TRUST ISSUES','Easy · Moderate'],['THINK AGAIN','Moderate'],
 ['NOTHING IS ACCIDENTAL','Moderate · Hard'],['THE GAME KNOWS','Hard'],['THE FINAL TEST','Hard · Expert']
];
const L=(name, data={})=>({name,gaps:[],spikes:[],crumble:[],blink:[],movers:[],switches:[],fallers:[],triggers:[],walls:[],fake:[],...data});
// Exact coordinates, triggers and combinations are individually specified.
export const levels=[
 L('The Obvious Door'),
 L('One Small Hop',{gaps:[[10,12]]}),
 L('Pointy Things',{spikes:[10,17]}),
 L('Trust the Floor',{crumble:[9,10],spikes:[16]}),
 L('Too Quiet',{triggers:[['spike',12,15]],spikes:[20]}),
 L('Long Way Around',{gaps:[[8,11]],spikes:[16]}),
 L('Something Fell',{fallers:[13],spikes:[19]}),
 L('Blink and Miss',{blink:[10,11],spikes:[18]}),
 L('Actually, Stop',{triggers:[['spike',11,13]],crumble:[18]}),
 L('First Betrayal',{gaps:[[8,10]],triggers:[['spike',15,17]],fallers:[20]}),
 L('Thin Ice',{crumble:[7,8,9],spikes:[16]}),
 L('Now You See It',{blink:[8,9],gaps:[[16,18]]}),
 L('The Welcome Mat',{triggers:[['spike',9,12]],spikes:[18]}),
 L('Mind the Ceiling',{fallers:[9,17],gaps:[[12,14]]}),
 L('Wrong Address',{fake:[17],spikes:[11]}),
 L('A Short Detour',{gaps:[[7,9],[16,18]],crumble:[12]}),
 L('Stand Still',{triggers:[['chase',9,12]],spikes:[19]}),
 L('Moving Target',{movers:[[9,11,3]],gaps:[[9,13]]}),
 L('The Patient Path',{blink:[11,12,13],spikes:[18]}),
 L('Trust Exercises',{fallers:[7,16],crumble:[10,11],spikes:[20]}),
 L('Press for Trouble',{switches:[[9,17]],walls:[17]}),
 L('Second Thoughts',{gaps:[[8,11]],switches:[[14,19]],walls:[19]}),
 L('Time It Right',{blink:[7,8,15,16],spikes:[20]}),
 L('The Switchback',{switches:[[7,15]],walls:[15],spikes:[11,20]}),
 L('Give It a Second',{triggers:[['delay',9,13]],gaps:[[17,19]]}),
 L('Look Before Landing',{gaps:[[9,12]],fallers:[16],spikes:[19]}),
 L('The Fake Shortcut',{fake:[13],switches:[[9,20]],walls:[20]}),
 L('Ride and Decide',{movers:[[8,12,3]],gaps:[[8,14]],spikes:[19]}),
 L('A Little Less Solid',{crumble:[7,8,14,15],blink:[11,12]}),
 L('The Rehearsal',{switches:[[8,19]],walls:[19],triggers:[['spike',12,15]],fallers:[17]}),
 L('No Sudden Moves',{triggers:[['chase',8,11]],gaps:[[16,18]]}),
 L('Falling for It',{fallers:[8,12,19],crumble:[15]}),
 L('Familiar Shapes',{spikes:[7,20],blink:[11,12],fake:[17]}),
 L('Plan B',{switches:[[12,18]],walls:[18],gaps:[[8,10]],spikes:[15]}),
 L('The Retreat',{triggers:[['spike',10,13]],fallers:[17],spikes:[20]}),
 L('Not the Same Door',{fake:[19],gaps:[[9,11]],crumble:[15]}),
 L('Wait for the Rhythm',{blink:[8,9,15,16],fallers:[20]}),
 L('Under Pressure',{switches:[[8,20]],walls:[20],fallers:[11,16]}),
 L('Floorless Logic',{gaps:[[8,11],[16,19]],movers:[[8,11,2],[16,19,2]]}),
 L('The Double Bluff',{triggers:[['delay',8,12]],fake:[17],spikes:[20]}),
 L('Old Habits',{crumble:[7,8],switches:[[12,19]],walls:[19],spikes:[16]}),
 L('Too Convenient',{fake:[14,18],fallers:[11,20]}),
 L('The Second Switch',{switches:[[8,15],[17,21]],walls:[15,21],spikes:[12]}),
 L('Nothing Stays Put',{blink:[7,8,16,17],movers:[[10,13,2]],gaps:[[10,14]]}),
 L('A Very Nice Trap',{triggers:[['chase',8,12]],crumble:[14,15],spikes:[19]}),
 L('One Step Back',{switches:[[7,19]],walls:[19],fallers:[11,16],spikes:[14]}),
 L('Remember the Gap',{gaps:[[8,11],[17,19]],blink:[13,14]}),
 L('A Door-Shaped Lie',{fake:[12,17],triggers:[['spike',18,20]]}),
 L('Less Than Helpful',{fallers:[7,13,19],blink:[10,11,16]}),
 L('The Examination',{switches:[[9,20]],walls:[20],gaps:[[13,15]],fallers:[17],spikes:[11]}),
 L('Composure',{crumble:[7,8,9],fallers:[15,20],spikes:[12]}),
 L('Two Steps Ahead',{gaps:[[8,10],[16,18]],switches:[[12,21]],walls:[21]}),
 L('No More Hints',{blink:[8,9,14,15],triggers:[['delay',12,18]]}),
 L('Decoy Season',{fake:[10,16,20],spikes:[13]}),
 L('The Narrow Escape',{gaps:[[8,11],[17,20]],movers:[[8,11,2],[17,20,2]]}),
 L('Full Circle',{switches:[[8,18]],walls:[18],crumble:[12,13],fallers:[16,21]}),
 L('The Hesitation',{triggers:[['chase',7,11],['delay',14,18]],spikes:[20]}),
 L('The Unwelcome Reunion',{blink:[7,8,16,17],fallers:[11,19],fake:[14]}),
 L('Everything You Know',{switches:[[8,20]],walls:[20],gaps:[[12,14]],fallers:[16],crumble:[18],spikes:[10]}),
 L('The Last Door',{gaps:[[8,10],[16,18]],switches:[[12,21]],walls:[21],triggers:[['spike',13,15]],fallers:[19],fake:[20]})
];
export function validateLevels(){
 const errors=[];if(levels.length!==60)errors.push(`Expected 60 levels, got ${levels.length}`);
 levels.forEach((l,i)=>{
  if(!l.name||typeof l.name!=='string')errors.push(`${i+1}: missing name`);
  for(const [a,b] of l.gaps){if(!(a>=3&&b<=22&&b>a))errors.push(`${i+1}: bad gap`)}
  for(const p of [...l.spikes,...l.crumble,...l.blink,...l.fallers,...l.fake])if(p<3||p>21)errors.push(`${i+1}: bad tile ${p}`);
  for(const [x,w] of l.switches){if(x<3||x>21||w<=x||w>22)errors.push(`${i+1}: invalid switch`)}
 });return errors;
}