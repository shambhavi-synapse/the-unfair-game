# THE UNFAIR GAME

An original, zero-backend browser platformer with **60 individually scripted levels** across six chapters. Built with Canvas, vanilla JavaScript, CSS and browser localStorage. No assets borrowed from *Level Devil*.

## Play locally

Use a local web server, because ES module imports usually cannot be loaded via `file://`.

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`.

## Controls

- A/D or arrow keys: move
- W, Up or Space: jump
- R: restart
- Escape: pause
- Touch: on-screen arrows and jump

## Run tests

```bash
npm test
```

## Publishing

Create a **new, empty** GitHub repository, upload the contents of this directory to its default branch, then in **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select the default branch and `/ (root)`. The game will load at `https://YOUR_USERNAME.github.io/YOUR_REPO/` after GitHub Pages builds.

## Verification caveat

The included automated tests check 60 definitions, names, spawn/exit ground, switch references and layout diversity. They do **not** prove all 60 levels are fun or physically solvable. Full manual playtesting, frame-rate testing, assistive-technology checks and mobile-device checks are still required. This is a functioning first playable build, **not a certified final 60-level release**.

## Notes

Saved progress resides in each browser's localStorage. Audio uses Web Audio synthesis and only starts after player input. Fonts use Google Fonts when connected, with local fallbacks; download and self-host the OFL-licensed fonts for fully offline typography.