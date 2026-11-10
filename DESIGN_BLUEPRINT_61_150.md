# DOORODO 150: Authored Expansion Blueprint (NOT PLAYABLE LEVELS)

**Status:** Levels 1–60 exist in code. Levels 61–150 below are **design proposals only**, not placeholders, implemented levels, or verified completions. No new definitions are added to the shipping roster by this document. Existing 60-level source audit: `LEVEL_AUDIT_60.md`.

**Validation gate for every proposal:** implement collision and state transitions; write a successful recorded input trace using actual engine physics; fail a hold-right shortcut check; test restart and save; verify portrait/landscape and manually inspect difficulty. Bosses additionally need a successful connected multi-phase run.

## Chapter 7: Trust the Process (levels 61–70)

| Level | Working title | Distinct mechanic and intended counterplay | Status |
|---:|---|---|---|
| 61 | The Conveyor That Apologised | Reverse conveyor switches direction only while jumping; ride momentum to the next ledge | Design only |
| 62 | The Backward Instruction | Horizontal controls invert between two gates; stop, identify the flipped region, then traverse using reversed input | Design only |
| 63 | A Door with a Schedule | Exit travels a circular track; intercept it only after stopping a conveyor | Design only |
| 64 | Assisted Failure | A floor press launches rather than crushes when its return stroke begins; exploit it to gain height | Design only |
| 65 | Shift Handover | Two moving bridges exchange roles when a switch is touched; use the now-empty path as access to the lower passage | Design only |
| 66 | Risk Assessment | Fan periodically changes airflow while floor segments fall away; shelter behind blocks before launching across | Design only |
| 67 | The Excessive Lift | Lift rises past the exit then descends, requiring a precise exit on the return journey | Design only |
| 68 | Maintenance Tunnel | A seemingly blocked wall contains a short lower tunnel revealed when the roller strikes its hinge | Design only |
| 69 | Employee Entrance | Two visually identical doors return to different routes; a pressure plate changes their mapping deterministically | Design only |
| 70 | PROCESS FAILED (BOSS) | Three phases: inverted controls to reach a lever, redirected roller through a gate, timed conveyor and exit; record each phase's safe reset | Design only; boss with multiple phases |

## Chapter 8: Perfectly Safe (levels 71–80)

| Level | Working title | Distinct mechanic and intended counterplay | Status |
|---:|---|---|---|
| 71 | No Issues Reported | A quiet empty room is genuinely safe, contrasting earlier levels | Design only |
| 72 | Friendly Floor | A collapsing platform lowers to a useful ledge; use its second position | Design only |
| 73 | The Cushion | A falling square stops a crusher; use the square as temporary cover | Design only |
| 74 | Harmless Looking | One-way floor disguises a lower passage; drop through at a marked structural join | Design only |
| 75 | Perfect Coverage | A moving hole follows the player until they stop, then advances; freeze it by waiting | Design only |
| 76 | The Air Is Fine | Fans push opposite directions in alternating rooms; carry momentum into the middle safe zone | Design only |
| 77 | This Is Normal | A giant hammer is safe on the backswing; cross beneath it at a predictable phase | Design only |
| 78 | Health and Safety | Fake door starts rising water; jump onto a floating slab to access the true exit | Design only |
| 79 | Guaranteed Exit | The first exit is real, but a gate only opens once a hostile moving wall has been led into a switch | Design only |
| 80 | SAFETY INSPECTION (BOSS) | Four linked phases: moving hole, hammer shelter, rising water ride and exit behind a redirected press | Design only; boss with multiple phases |

## Chapter 9: The Usual Route (levels 81–90)

| Level | Working title | Distinct mechanic and intended counterplay | Status |
|---:|---|---|---|
| 81 | The Same Shortcut | A route familiar from a prior level now contains a retractable bridge; approach through the side tunnel | Design only |
| 82 | Detour in Progress | Door slides away along floor and must be pinned between two retracting gates | Design only |
| 83 | Wrong Way Home | Two portals preserve momentum; choose the arrival with room to brake | Design only |
| 84 | The Commuter | A pursuit obstacle crosses the map on an elevated track and rejoins near the exit | Design only |
| 85 | Wrong Address Twice | Two identical fake doors reposition a single true exit; follow the displaced floor tile instead | Design only |
| 86 | Old Road | Traveling floor gap doubles back at the wall; avoid by leaping onto a moving platform | Design only |
| 87 | Shorter Route | A secret overhead passage opens only after the player retreats to release a pressure plate | Design only |
| 88 | Meet in the Middle | Two moving platforms start apart; jump to the one only when their rails intersect | Design only |
| 89 | Transfer Point | Portal displaces player and boulder together; arrive in a side chamber then use boulder as weight | Design only |
| 90 | ROAD CLOSED (BOSS) | Connected detour phases: moving pit, two-way portal, returning pursuer and mobile exit behind a gate | Design only; boss with multiple phases |

## Chapter 10: Almost Finished (levels 91–100)

| Level | Working title | Distinct mechanic and intended counterplay | Status |
|---:|---|---|---|
| 91 | The Last Few | Real exit sits behind a stationary door; opening the decoy moves a lift into place | Design only |
| 92 | Just One Button | Switch opens gate but starts a fan; return behind a wall and jump with the flow | Design only |
| 93 | The Endless Hall | Background repeats but coordinates do not; use a moving tile as the persistent clue | Design only |
| 94 | Fine Print | Controls reverse only when grounded on dark tiles; jump to preserve direction while crossing | Design only |
| 95 | Almost a Shortcut | Retracting stairs tempt a direct approach; ride the side platform instead | Design only |
| 96 | The Helpful Enemy | Crusher must strike the wall to free the door; lure it using a safe alcove | Design only |
| 97 | Warranty Void | Switch drains water, leaving a platform stranded; keep some water to ride up | Design only |
| 98 | Final Approach | Door moves closer when stationary, but floor shifts under prolonged waiting | Design only |
| 99 | Exit Interview | Three doors each alter the same conveyor; choose sequence to align the true exit | Design only |
| 100 | ALMOST FINISHED (BOSS) | Four phases: water control, shifting stairs, redirected crusher and door timing; no checkpoint skips | Design only; boss with multiple phases |

## Chapter 11: Further Instructions (levels 101–110)

| Level | Working title | Distinct mechanic and intended counterplay | Status |
|---:|---|---|---|
| 101 | Instruction One | Switch activates an invisible-to-you mechanism far away, evidenced by moving architecture, not text | Design only |
| 102 | Instruction Two | Door rotates its collision side after an event; approach from opposite direction | Design only |
| 103 | Footnote | Low ceiling makes ordinary jumps fail; slide along belt with short hops | Design only |
| 104 | Please Initial Here | Two pressure plates require a rolling block to hold the distant one | Design only |
| 105 | For Reference | Delayed duplicate mirrors earlier player movements; use copy to trigger a plate | Design only |
| 106 | Additional Terms | Fan makes normal jump overshoot; interrupt airflow with a movable shutter | Design only |
| 107 | Revision Three | Floor remembers last touched tile and retracts it after leaving; plan return journey | Design only |
| 108 | Appendix A | Pair of portals swap destinations after a switch; observe a harmless test object | Design only |
| 109 | Read Carefully | Door moves on a timer but responds to player acceleration, not direction | Design only |
| 110 | MANDATORY READING (BOSS) | A four-part circuit combining a replay ghost, pressure-plate block, switched portal mapping and animated exit | Design only; boss with multiple phases |

## Chapter 12: Nothing Personal (levels 111–120)

| Level | Working title | Distinct mechanic and intended counterplay | Status |
|---:|---|---|---|
| 111 | The Critic | A crusher follows footsteps but ignores motionless players; use deliberate starts and stops | Design only |
| 112 | Collateral Damage | Falling object helps by opening the path but damages the adjacent bridge; choose sequence | Design only |
| 113 | Of Course Not | A pursuer refuses to chase until player jumps; use the jump to trigger its useful collision | Design only |
| 114 | Unsolicited Help | A moving barrier pushes player toward the wrong exit, so circle behind it | Design only |
| 115 | Team Building | Mirror clone duplicates horizontal motion only; stand on one switch while clone crosses another | Design only |
| 116 | Cordial Welcome | Fake door sends player back via portal with preserved velocity; rebound onto alternate ledge | Design only |
| 117 | Personal Space | Door advances if approached too slowly; control speed using ice and a fan | Design only |
| 118 | The Meeting | Two crushers converge but leave a survivable pocket between their arcs | Design only |
| 119 | Constructive Feedback | Falling blocks form stairs in a repeatable order; climb after the drop | Design only |
| 120 | PERFORMANCE REVIEW (BOSS) | Alternating pursuit and clone puzzle, with falling-block staircase and final moving doorway | Design only; boss with multiple phases |

## Chapter 13: One Last Thing (levels 121–130)

| Level | Working title | Distinct mechanic and intended counterplay | Status |
|---:|---|---|---|
| 121 | One Extra Step | Exit only works after a final tile registers contact; intentionally cross past the first door | Design only |
| 122 | The Receipt | A switch runs a chain reaction then restores its own position; time backtracking | Design only |
| 123 | Afterthought | A harmless loose tile becomes a bridge after pressing the fake exit | Design only |
| 124 | Unclaimed Item | A bouncing block follows the player and can trigger a distant plate | Design only |
| 125 | Just Checking | Player shadow becomes solid after a pause; ride it across a one-way platform | Design only |
| 126 | An Entirely Minor Detail | Door changes floor friction while open; enter by managing momentum | Design only |
| 127 | Still Going | Moving hazard pauses at the door, blocking it unless lured away | Design only |
| 128 | Left Behind | Portal sends obstacle to its starting position; use the loop to delay pursuit | Design only |
| 129 | One More Click | A fake door triggers an absurd three-device sequence; use the second consequence as the path | Design only |
| 130 | THE SMALL PRINT (BOSS) | Boss phases: moving shadow shelter, returning obstacle, false-victory door and final post-door challenge | Design only; boss with multiple phases |

## Chapter 14: Final Preparations (levels 131–140)

| Level | Working title | Distinct mechanic and intended counterplay | Status |
|---:|---|---|---|
| 131 | Dry Run | Room demonstrates a safe mechanical cycle; on return, timing has shifted deterministically | Design only |
| 132 | Checklist | Three separate switches each modify a different piece of terrain; order matters | Design only |
| 133 | Packing Light | Carried momentum across conveyor makes the intended exit inaccessible unless braking early | Design only |
| 134 | Final Drill | Crushers attack only where player last stopped; lure them to a clear lane | Design only |
| 135 | Backup Route | Primary bridge falls, secondary path becomes visible behind a portal | Design only |
| 136 | Emergency Contact | Falling square breaks a gate while fan diverts its descent | Design only |
| 137 | Not A Trap | Suspicious route is entirely safe, but an optional shortcut is mechanically difficult | Design only |
| 138 | System Test | An obstacle changes allegiance from chaser to temporary shield after button press | Design only |
| 139 | All Set | Exit is on wheels; hold it briefly in place using a movable barrier | Design only |
| 140 | PREPARATION COMPLETE (BOSS) | Four stages: sequential switches, obstacle-as-shield, fan-directed falling square and wheeled exit | Design only; boss with multiple phases |

## Chapter 15: The Exit (levels 141–150)

| Level | Working title | Distinct mechanic and intended counterplay | Status |
|---:|---|---|---|
| 141 | Last First Step | Opening a simple door reveals a second chamber rather than completion | Design only |
| 142 | The Third Option | Two fake doors and one true portal; identical visual styling but different learnable outcomes | Design only |
| 143 | Nothing Left | A corridor changes geometry only after player passes its center; reverse and exploit it | Design only |
| 144 | The Perfect Loop | Portals return to the same room until a block changes the arrival offset | Design only |
| 145 | A Familiar Enemy | Roller once again opens the gate, but now requires rerouting via fan | Design only |
| 146 | A Familiar Floor | Moving gap is controlled by a switch that also shifts the real exit | Design only |
| 147 | One Very Long Moment | Two delayed player copies activate remote plates on the return route | Design only |
| 148 | You Can Stop | A sudden harmless respite where the expected attack never occurs | Design only |
| 149 | The Last Attempt | A chase through changing terrain ends with an apparently fake exit that is genuinely real | Design only |
| 150 | THE EXIT (FINAL BOSS) | Five connected phases: deceptive entry, inverted-control route, boulder/fan gate, paired portals, and final quiet door; verify all phases and prevent progress award at false exits | Design only; boss with multiple phases |

## Engineering dependencies

1. Generalize level state and save migration beyond 60 without inventing unlocked progress.
2. Implement deterministic input inversion, portals with cooldown, moving holes as actual collision geometry, fans and water volumes as lightweight forces.
3. Add level-specific door admission rules, timers, boss phases and nonlethal fake-victory feedback.
4. Test every mechanism on keyboard and touch using the same logical input flags.
5. Keep all unreleased drafts on the development branch until input traces and browser playthroughs pass.
