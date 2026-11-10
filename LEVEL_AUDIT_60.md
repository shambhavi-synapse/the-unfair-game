# Doorodo: 60-Level Mechanics Audit

This is an automated, source-based audit of all **60** currently implemented level scripts. It is **not** a claim of full human beatability or fun. First 10 levels use extended scrolling maps; the other 50 retain the original 24-tile screens.

Legend: **H** = major manual testing risk, **M** = moderate, **L** = low structural concern. Risks do not mean confirmed impossibility.

| Level | Title | Width (tiles) | Mechanics | Review priority |
|---:|---|---:|---|---|
| 1 | An Easy Start | 36 | gaps, switch/gate, trigger, shy door | L |
| 2 | Just Keep Walking | 42 | gaps, spikes, crumble, bridge plate | M |
| 3 | The Floor Is Fine | 40 | spikes, timed floor, rolling gate | L |
| 4 | A Minor Adjustment | 44 | gaps, spikes, switch/gate, trigger | L |
| 5 | Two Doors. Cute. | 45 | gaps, switch/gate, door decoy | M |
| 6 | Read the Room | 46 | gaps, timed floor, switch/gate | L |
| 7 | Temporary Arrangement | 48 | gaps, spikes, crumble | M |
| 8 | Quite a Detour | 50 | gaps, switch/gate, trigger, door decoy | M |
| 9 | A Touch of Patience | 52 | gaps, spikes, timed floor, switch/gate | L |
| 10 | Beginner Friendly | 56 | gaps, spikes, crumble, timed floor, switch/gate | M |
| 11 | Thin Ice | 24 | spikes, crumble | M |
| 12 | Now You See It | 24 | gaps, timed floor | M |
| 13 | The Welcome Mat | 24 | spikes, trigger | H |
| 14 | Mind the Ceiling | 24 | gaps, ceiling drop | H |
| 15 | Wrong Address | 24 | spikes, door decoy | M |
| 16 | A Short Detour | 24 | gaps, crumble | M |
| 17 | Stand Still | 24 | spikes, trigger | M |
| 18 | Moving Target | 24 | gaps, moving platforms | M |
| 19 | The Patient Path | 24 | spikes, timed floor | M |
| 20 | Trust Exercises | 24 | spikes, crumble, ceiling drop | H |
| 21 | Press for Trouble | 24 | switch/gate | M |
| 22 | Second Thoughts | 24 | gaps, switch/gate | M |
| 23 | Time It Right | 24 | spikes, timed floor | M |
| 24 | The Switchback | 24 | spikes, switch/gate | M |
| 25 | Give It a Second | 24 | gaps, trigger | H |
| 26 | Look Before Landing | 24 | gaps, spikes, ceiling drop | H |
| 27 | The Fake Shortcut | 24 | switch/gate, door decoy, decoy-operated gate | M |
| 28 | Ride and Decide | 24 | gaps, spikes, moving platforms | H |
| 29 | A Little Less Solid | 24 | crumble, timed floor | M |
| 30 | The Rehearsal | 24 | switch/gate, ceiling drop, trigger | H |
| 31 | No Sudden Moves | 24 | gaps, trigger | M |
| 32 | Falling for It | 24 | crumble, ceiling drop | H |
| 33 | Familiar Shapes | 24 | spikes, timed floor, door decoy | M |
| 34 | Plan B | 24 | gaps, spikes, switch/gate | M |
| 35 | The Retreat | 24 | spikes, ceiling drop, trigger | H |
| 36 | Not the Same Door | 24 | gaps, crumble, door decoy | M |
| 37 | Wait for the Rhythm | 24 | timed floor, ceiling drop | H |
| 38 | Under Pressure | 24 | switch/gate, ceiling drop | H |
| 39 | Floorless Logic | 24 | gaps, moving platforms | M |
| 40 | The Double Bluff | 24 | spikes, trigger, door decoy | H |
| 41 | Old Habits | 24 | spikes, crumble, switch/gate | M |
| 42 | Too Convenient | 24 | ceiling drop, door decoy, nonterminal real door | H |
| 43 | The Second Switch | 24 | spikes, switch/gate | M |
| 44 | Nothing Stays Put | 24 | gaps, timed floor, moving platforms | M |
| 45 | A Very Nice Trap | 24 | spikes, crumble, trigger | M |
| 46 | One Step Back | 24 | spikes, switch/gate, ceiling drop | H |
| 47 | Remember the Gap | 24 | gaps, timed floor | M |
| 48 | A Door-Shaped Lie | 24 | trigger, door decoy | H |
| 49 | Less Than Helpful | 24 | timed floor, ceiling drop | H |
| 50 | The Examination | 24 | gaps, spikes, switch/gate, ceiling drop | H |
| 51 | Composure | 24 | spikes, crumble, ceiling drop | H |
| 52 | Two Steps Ahead | 24 | gaps, switch/gate | M |
| 53 | No More Hints | 24 | timed floor, trigger | H |
| 54 | Decoy Season | 24 | spikes, door decoy, nonterminal real door | M |
| 55 | The Narrow Escape | 24 | gaps, moving platforms | M |
| 56 | Full Circle | 24 | crumble, switch/gate, ceiling drop | H |
| 57 | The Hesitation | 24 | spikes, trigger | H |
| 58 | The Unwelcome Reunion | 24 | timed floor, ceiling drop, door decoy | H |
| 59 | Everything You Know | 24 | gaps, spikes, crumble, switch/gate, ceiling drop | H |
| 60 | The Last Door | 24 | gaps, switch/gate, ceiling drop, trigger, door decoy | H |

## Main findings

- **60 level definitions** exist, with **10** expanded maps and **50** older one-screen maps.
- Many obstacle combinations are adjacent rather than causally connected. The one-screen levels, especially 11–60, need manual playthrough and individual design.
- Level 28 includes a six-tile gap supported by a moving platform; the platform ride and jump timing require manual verification.
- Falling hazards appear in 17 definitions, while timed floors, gap crossing, and spike traversal recur frequently.
- All 60 definitions passed the source validator in this audit. Structural validity does not prove reachability.
- Real and fake doors now use the same renderer. Levels 42 and 54 include a real door before at least one decoy. Level 27 uses a decoy as an alternative gate-opening mechanism.
- The previously verified Level 3 route remains a separate automated physics test. None of these other levels is certified completed by this report.

## Required next quality gate

For each level, capture one successful engine-controlled or human playthrough, verify mobile portrait/landscape visibility and keyboard/touch equivalence, confirm restarts and trigger reset, measure whether holding right bypasses its central mechanic, then revise any softlocks or repetitive challenges.

## November 10: Mascot and environmental mechanisms development pass

All sixty source definitions were re-inspected. **Seven levels** received new authored environmental events in this pass. All other original level definitions remain, including the previous improvements to levels 1–3, 27, 42 and 54.

| Level | New linked event | What it changes |
|---:|---|---|
| 16 | Helpful bridge after crossing tile 12 | Unexpectedly fills the second gap, making the environment occasionally helpful |
| 24 | Door relocation after gate | The exit changes to a position behind the player after the switch/gate section |
| 25 | Bridge after delayed drop | A different, helpful environmental consequence interacts with a hazard section |
| 34 | Rear gate | A wall rises behind the player after the first obstacle and blocks a simple retreat |
| 48 | Door relocation | Two decoy doors gain a backtracking puzzle, with the actual exit moved after a threshold |
| 57 | Rear gate during pursuit | The pursuing sequence changes the available retreat path |
| 59 | Bridge appears ahead | A triggered platform turns a risky gap into a usable route |

The event system is deterministic and its state resets on restart. Automated engine tests cover each **event type** (not the full end-to-end route of each affected level). Reusing the existing physics and rendering systems avoids a wholesale engine replacement.

**Mascot identity:** Doorodo is now also the canonical name of the little yellow playable character. Added four locally hosted SVG vectors: compact character-and-door logo, favicon, app icon, and smirking About illustration. The original home wordmark keeps its typography and now ends with mascot-shaped punctuation. About introduces the character and retains the existing creator credit.

**Camera and mobile:** Retained the normal illuminated side-scrolling camera and landscape control dock. Corrected an orientation API bug caused by a local `screen` state variable shadowing the browser's `window.screen` object.

**Tests:** 34/34 checks passed in an adapted in-memory test harness. The full GitHub Actions Node test run, visually rendered web app, touch-device behavior and production deployment have **not** been independently verified in this pass.

**Not complete:** The required individual redesign and end-to-end human verification of **all sixty levels** is still pending. The seven new event levels are **not certified beatable** merely because their event transitions pass tests. Other levels have not been silently declared overhauled.
