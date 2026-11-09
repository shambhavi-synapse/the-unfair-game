// Hand-authored level scripts. Coordinates are 40px tiles, world 24 x 13.5 tiles.
// Grammar: gaps [start,end], hazards [tile], trigger scripts [kind,tile,...].
export const chapters=[
 ['A Simple Beginning','First impressions'],['Minor Inconveniences','Unreliable ground'],['Nothing to See Here','Deceptive paths'],['Working as Intended','Mechanisms'],['Please Proceed','False guidance'],
 ['A Matter of Timing','Rhythm'],['Trust the Process','Cause and effect'],['Perfectly Safe','Risk'],['The Usual Route','Route reversal'],['Almost Finished','Endurance'],
 ['Further Instructions','Coming later'],['Nothing Personal','Coming later'],['One Last Thing','Coming later'],['Final Preparations','Coming later'],['The Exit','Coming later']
];
export const badges=[
 {after:30,name:'Clocked It.',line:'Took you long enough.',mark:'◷'},
 {after:60,name:'Barely Competent',line:'An improvement. Technically.',mark:'✦'},
 {after:90,name:'Not Bad, Actually.',line:"You're getting good at this. How inconvenient.",mark:'◇'},
 {after:120,name:'The Audacity',line:"You're still here.",mark:'♜'},
 {after:150,name:'Now What?',line:'You can go now.',mark:'⌑'}
];
const L=(name, data={})=>({name,width:24,gaps:[],spikes:[],crumble:[],blink:[],movers:[],switches:[],fallers:[],triggers:[],walls:[],fake:[],...data});
// Exact coordinates, triggers and combinations are individually specified.
export const levels=[
 L('An Easy Start',{width:36,gaps:[[13,16],[27,29]],switches:[[21,25]],walls:[25],triggers:[['collapse',17,19]]}),
 L('Just Keep Walking',{width:42,gaps:[[9,12],[20,23],[34,37]],crumble:[16,17],spikes:[29]}),
 L('The Floor Is Fine',{width:40,crumble:[11,12,13],gaps:[[19,22]],blink:[29,30],spikes:[35]}),
 L('A Minor Adjustment',{width:44,gaps:[[14,17],[28,31]],switches:[[10,24]],walls:[24],spikes:[35,39],triggers:[['collapse',18,20]]}),
 L('Two Doors. Cute.',{width:45,gaps:[[15,18],[32,35]],fake:[25],switches:[[28,39]],walls:[39]}),
 L('Read the Room',{width:46,gaps:[[13,16],[29,32]],blink:[20,21],switches:[[35,40]],walls:[40]}),
 L('Temporary Arrangement',{width:48,gaps:[[17,20],[33,36]],crumble:[10,11,27,28],spikes:[23,42]}),
 L('Quite a Detour',{width:50,gaps:[[12,15],[26,29],[40,43]],switches:[[20,35]],walls:[35],fake:[31],triggers:[['collapse',31,33]]}),
 L('A Touch of Patience',{width:52,gaps:[[14,17],[31,34],[44,47]],blink:[21,22,38,39],spikes:[27],switches:[[41,49]],walls:[49]}),
 L('Beginner Friendly',{width:56,gaps:[[12,15],[25,28],[40,43]],crumble:[19,20],switches:[[32,47]],walls:[47],blink:[34,35],spikes:[50]}),
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
 const errors=[];if(chapters.length!==15)errors.push('Expected 15 chapter definitions');if(levels.length!==60)errors.push(`Expected 60 levels, got ${levels.length}`);
 levels.forEach((l,i)=>{
  if(!l.name||typeof l.name!=='string')errors.push(`${i+1}: missing name`);
  for(const [a,b] of l.gaps){if(!(a>=3&&b<=l.width-2&&b>a))errors.push(`${i+1}: bad gap`)}
  for(const p of [...l.spikes,...l.crumble,...l.blink,...l.fallers,...l.fake])if(p<3||p>=l.width-2)errors.push(`${i+1}: bad tile ${p}`);
  for(const tr of l.triggers){if(tr[0]==='collapse'&&(tr[2]<3||tr[2]+1>=l.width-2))errors.push(`${i+1}: bad collapse trigger`)}
  for(const [x,w] of l.switches){if(x<3||x>=l.width-2||w<=x||w>=l.width-1)errors.push(`${i+1}: invalid switch`)}
 });return errors;
}