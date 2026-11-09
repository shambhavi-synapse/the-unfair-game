# Doorodo gameplay audit and next development pass

## Verified baseline
- Existing vanilla JS Canvas game, no backend. Repository and 60 level scripts retained.
- 15 finalized chapter names and five badge thresholds (30, 60, 90, 120, 150) retained.
- Existing progress key `unfair-game-v1` preserved to avoid accidental save loss.
- At the beginning of this pass, levels 11–60 mostly use the same one-screen width (24 × 40px tiles).
- Automated tests check definitions and some mechanics, not full human beatability.

## Levels 35–45 audit
- 35 The Retreat: scripted emerging spike plus falling object. Reaction timing unclear.
- 36 Not the Same Door: fake door, gap and crumbling floor. Mostly independent obstacles.
- 37 Wait for the Rhythm: blinking ground and falling object. Timing challenge but limited chain.
- 38 Under Pressure: switch plus two falling objects. Switch is not meaningfully linked to hazards.
- 39 Floorless Logic: moving platforms across two gaps. Better movement idea, but platform support and timing need browser playtesting.
- 40 The Double Bluff: delayed ceiling hazard, decoy door and spike. Three independent tricks in a single screen; not a robust benchmark by itself.
- 41 Old Habits: crumble, switch, wall and spike. Potential interaction but mostly linear.
- 42 Too Convenient: two decoys and two falling objects. Repeats previous trick vocabulary.
- 43 The Second Switch: two gate switches plus spike. Some sequential gating.
- 44 Nothing Stays Put: blink tiles, moving platform and gap. An interesting combination, but needs geometry checks.
- 45 A Very Nice Trap: pursuing rectangle, crumble floor and spike. Chase AI currently lacks alternate route or barrier interactions.

## Work implemented during this pass
- New deterministic pure mechanism module:
  - **Shy door:** moves away when approached, returns toward a stationary player; entry requires stopping.
  - **Switch bridge:** player steps on a plate to extend a missing bridge section.
  - **Rolling obstacle / gate:** pursuer is triggered at a specified coordinate and can open its designated barrier on collision.
- First three level definitions updated to exercise each system differently; old levels 4–60 retained for later work.
- Landscape-first phone recommendation is optional, attempts fullscreen and orientation lock only on button click, leaves portrait usable.
- Commentary is muted by default on ordinary deaths, with a few event-specific lines and a persisted Settings toggle.
- Focused unit tests cover mechanism transitions, bounds, and door reachability.

## Important limitations and remaining work
1. Full browser playthroughs of revised levels 1–3 have **not** been completed; reactiveness, camera visibility, and human solvability are not certified.
2. Levels 4–10 still need major handcrafted redesign. Existing chapters 2–6 require broader overhaul.
3. The additional 90 planned levels are not implemented. Badges for levels 90/120/150 cannot yet be earned.
4. The rolling obstacle uses a floor-height horizontal track rather than gravity simulation. Its assigned puzzle lane should stay continuous; future levels must account for its movement assumptions.
5. The bridge and shy-door visual clarity, audio, phone touch control and display framing require genuine device playtesting.
6. Production GitHub Pages deployment after this commit has not been independently verified.

## Quality gate for next pass
Before expanding the roster, manually complete each new level on keyboard and touch. Record a successful run and a hold-right failure; check reset invariants, player reaction time, and portrait/landscape visibility. Discard traps that cannot provide a meaningful decision.
