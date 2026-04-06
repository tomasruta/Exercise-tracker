# ATG Gym Workout Tracker — Roadmap

## Now
- [ ] Apply spec amendment from Claude Chat (`gym-tracker-spec-amendment.md`)
- [ ] Update programme data (sled tracking, ATG split squat rename, etc.)
- [ ] Rework exercises per new handover requirements

## Next
- [ ] Better exercise breakdowns (form cues, set structure)
- [ ] Add to Home Screen on iPhone SE (needs Safari access during AppBlock window)
- [ ] Verify full round-trip: log → export → clear → import → verify

## Later
- [ ] Programme rotation: when routine changes, regenerate PROGRAMME but keep IDs stable
- [ ] Size audit (currently ~62KB, budget 500KB)
- [ ] Consider service worker for true offline PWA

## Done
- [x] Full tracker built — single HTML file, all 6 workouts, ~80 exercises
- [x] Hash-based SPA routing, dark mode, iOS PWA meta tags
- [x] Exercise detail with weight/reps inputs, auto-bump, progression banners
- [x] Markdown export (single session + bulk) and import with fuzzy matching
- [x] Session history with per-session export tracking
- [x] Unexported session warning banner on home screen
- [x] Settings page with individual session export
- [x] GitHub Pages deployment: tomasruta.github.io/Exercise-tracker/tracker.html
- [x] Crash recovery via `gym-session-wip` auto-save
