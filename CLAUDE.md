# ATG Gym Workout Tracker

## Tech Stack
- Single self-contained HTML file (`tracker.html`)
- Zero dependencies — no build step, no CDN, no imports
- Vanilla JS (ES6+), CSS custom properties, system font stack
- localStorage for data persistence

## How to Run
- Open `tracker.html` in any browser (works offline)
- iPhone SE Safari is the primary target
- File syncs across devices via iCloud/Google Drive

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

## Two Separate Tracks
This project has two independent workstreams. **Do not conflate them.**

1. **Tracker app** (features, UX, bugs, architecture) — logged in `SESSION_LOG.md`, tracked in the "Tracker App" section of `ROADMAP.md`.
2. **Form cues content** (updating exercise cue text from session notes / AI review) — tracked in the "Form Cues Content" section of `ROADMAP.md`. **⚠️ Always prompt the user before starting any form cues work.** There are no cue changes planned right now; the user will initiate this when ready.

When working on the tracker app, do not bundle in form cue content changes (or vice versa). Keep commits, session log entries, and roadmap updates scoped to one track at a time.

## Gotchas
- Exercise IDs must NEVER have workout suffixes (no `-w1`). They're the stable contract for cross-workout history lookup.
- Programme changes every ~2 months — regenerate the HTML but keep IDs stable.
- `navigator.share()` only works on iOS/mobile. Desktop falls back to clipboard.
- Safari localStorage persists across restarts but can be cleared by user or extreme storage pressure.
