# ATG Gym Workout Tracker

## Tech Stack
- Single self-contained HTML file (`tracker.html`)
- Zero dependencies — no build step, no CDN, no imports
- Vanilla JS (ES6+), CSS custom properties, system font stack
- localStorage for data persistence

## How to Run
- Open `tracker.html` in any browser (works offline)
- iPhone SE Safari is the primary target
- Deployed via GitHub Pages (tomasruta.github.io/Exercise-tracker/tracker.html)

## How to Test
1. Open on iPhone Safari in airplane mode
2. Log a full W1 session with weights/reps/notes
3. Close Safari, reopen — verify data persists
4. Export markdown, clear localStorage, re-import — verify round-trip
5. Toggle dark mode — verify readability

## Key Architecture
- Programme data baked into HTML as JS object (PROGRAMME constant)
- Exercise IDs are consistent across workouts (e.g., `back-extension` in W1/W3/W6)
- Hash-based SPA routing (#/w/1, #/w/1/e/5, etc.)
- IIFE module pattern (Data, State, Progression, Markdown, Views, Router, App)
- Working session auto-saved to `gym-session-wip` on every input change

## localStorage Keys
- `gym-sessions` — completed session history
- `gym-session-wip` — current in-progress session (crash recovery)

## Gotchas
- Exercise IDs must NEVER have workout suffixes (no `-w1`). They're the stable contract for cross-workout history lookup.
- Programme changes every ~2 months — regenerate the HTML but keep IDs stable.
- `navigator.share()` only works on iOS/mobile. Desktop falls back to clipboard.
- Safari localStorage persists across restarts but can be cleared by user or extreme storage pressure.

## Symlinked Source Files

`strength-routine-2026-04-05.md` is a symlink to `~/Documents/Health/Exercise/strength-routine-2026-04-05.md` (the canonical copy maintained in Claude chat Health project).

**On session start:** Before making any tracker changes, read the routine file and check for updates that haven't been reflected in `tracker.html` yet. Look for:
- New exercises or removed exercises
- Changed exercise order
- Changed sets/reps/tracking types
- New notes or form cues

Flag any discrepancies before proceeding with the user's request.
