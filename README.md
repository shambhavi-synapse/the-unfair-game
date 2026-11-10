# Doorodo

*A game about reaching a door. Good luck with that.*

Made by a bored student. **Shambhavi**.

Original 2D browser platformer built with HTML Canvas, vanilla JavaScript and CSS for static GitHub Pages hosting.

## Development status

This is an **in-progress overhaul**, not a completed 150-level game. The first 10 levels have been redesigned as longer scrolling challenges. The original 50 remaining scripted level definitions are preserved and require substantial gameplay redesign and manual playtesting. Chapter names for all 15 planned chapters are present; chapters 7–15 do **not** yet contain levels. The five-badge collection is implemented, with only the first two badges currently earnable after levels 30 and 60. Do not describe the game as 150 complete levels.

## Controls

- Move: A/D or left/right arrow
- Jump: Space, W or up arrow
- Restart: R
- Pause: Escape
- Touch: on-screen controls

## Run

Serve the project from a local web server, e.g. `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Tests

Run `npm test` (Node.js 18+). The automated tests cover level structure, basic geometry, badge definitions and chapter metadata. They do not prove that all levels can be completed, are fair, or are fun. Browser playtesting and accessibility/mobile checks remain necessary.

## Saved progress

The game retains the original `unfair-game-v1` localStorage key to preserve existing saves when upgrading from The Unfair Game. Reset progress uses confirmation.

## Deployment

The existing `.github/workflows/deploy.yml` runs tests and deploys to GitHub Pages after a push to `main`.

## November 9 gameplay/mobile patch

- Gameplay uses the available viewport height, preserving un-stretched game geometry by resizing the canvas coordinate width. Responsive mobile controls and scrollable, fitted overlays were checked in local Chromium at 320×568, 360×740, 390×844, 844×390 and 1280×800.
- Menu badge and About navigation opened and closed successfully in local Chromium. Assets are cache-busted to help existing browsers pick up the newer version.
- Three opening levels introduce deterministic, telegraphed collapsing-floor events. Predictable overhead drop hazards were removed from the opening chapter. All ten opening levels failed a simulated hold-right-only strategy, but none have been certified human-beatable or fairly balanced.
- The 15 finalized chapter names and five award thresholds remain unchanged. Only 60 levels are implemented; the target of 150 remains unfinished.
- Local automated tests: 10 passing. Production GitHub Pages deployment and live mobile gameplay verification require external checking.

## November 10: Official Doorodo mascot and game-mechanic pass

**Doorodo** is both the game's title and its small yellow playable character. The original wordmark now uses the miniature mascot as its punctuation. Local vector artwork is hosted in `assets/`: `doorodo-logo.svg` (character suspiciously eyeing a closed door), `doorodo-favicon.svg`, `doorodo-app-icon.svg`, and `doorodo-about.svg`.

The existing 60 level scripts remain; seven levels (16, 24, 25, 34, 48, 57, 59) were updated with new deterministic environmental events in this pass. Added helpful triggered bridges, rear gates and relocated exits. The orientation control now calls the actual browser `window.screen.orientation` API where supported; the bottom landscape control dock remains untouched.

This **does not complete the requested sixty-level overhaul**. All 60 definitions were inspected, but only seven received new level-specific event content this pass. Playthrough validation is still required for those seven and for the other levels. Test checks confirm event transitions, reset behavior and existing structural constraints; tests cannot establish difficulty, fairness or fun. See `LEVEL_AUDIT_60.md`.
