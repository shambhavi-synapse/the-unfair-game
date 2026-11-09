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
