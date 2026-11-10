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

## November 10, 2026: Level 3 and mobile repair

- Confirmed prior Level 3 roller started at tile 10, triggered only at tile 14, and crawled toward the tile-31 gate; no switch existed. The apparent blocked-wall defect was caused by slow, unexplained gate timing.
- Moved roller to tile 19 and trigger to tile 22, preserved the gate at tile 31 and moved blink hazards away from the waiting area to tiles 14–15. The gate now displays a matching impact symbol.
- A scripted **actual main.js physics** route successfully reached the exit: cross the blink hazard with a jump, approach the wall, wait/jump the ball, let the ball hit the gate, then jump the final spike. The simulation recorded gate opening near 5.8s and level completion near 7.87s. This is an automated route, **not** a human playthrough.
- Fixed a media-query landscape width cap that had reduced the playable canvas to about 1.78 times the available vertical dimension. Gameplay now uses the available width; canvas backing geometry continues adjusting to the displayed ratio.
- Touch controls now use flex centering, zero padding, consistent icon font/line-height, 56×52px landscape targets, and safe-area-aware edge placement.
- Added progressive forward visibility (535 world units plus a gradient) to avoid showing most of a short level at once on very wide viewports. Obstacle information should appear well ahead of physical contact; it still requires mobile-device evaluation.
- Updated asset version query values so browsers request fresh CSS and JavaScript.
- Added `tests/engine-level3.test.js` to execute the live engine's fixed-step movement and validate a successful route; `tests/level3.test.js` covers deterministic ball/gate models and waiting-area geometry.
- Existing first-10 and levels 11–60 human playthroughs, mobile screenshots and GitHub Pages production verification remain unconfirmed. Do not describe this as complete game validation.

## November 10: Landscape control / camera / door-identity patch

- Removed the artificial progressive fog/shadow gradient entirely. The game now relies on standard camera scrolling and a uniform wide-screen zoom that limits how much world geometry appears at once. Landscape and portrait world objects remain drawn at the same scale in both directions.
- Moved landscape coarse-pointer touch controls into a dedicated dock **below** the canvas. This avoids drawing the movement or jump controls on top of the playable platform. Retained safe-area insets.
- Unified fake and real exit drawing through one `drawDoor` renderer, including identical dimensions and opacity. As a targeted variation, level 42 and 54 may place the real door before another decoy. Level 27's fake door can open its gate.
- Removed the pre-trigger floor seam indicators and pre-trigger hanging ceiling objects. Cracks now appear only after collapse begins. Trigger timing is unchanged, so visual reaction fairness still needs human checks.
- All **60** current level scripts were inspected using a static audit, written to `LEVEL_AUDIT_60.md`. Fifty are still one-screen maps and require individual redesign. This pass does **not** claim all 60 have been overhauled or played through.
- Added code-level regression checks for natural camera, shared door rendering, and the control dock. Local adapted harness: **26 checks passed**; module syntax and level validator passed.
- Headless Chromium local navigation did not complete and GitHub Pages production could not be independently fetched. No visual device or production deployment success is claimed.
