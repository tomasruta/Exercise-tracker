# ATG Gym Workout Tracker — Roadmap

## Now
- [ ] Add to Home Screen on iPhone SE (needs Safari access during AppBlock window)
- [ ] Real-device testing on iPhone SE Safari (all 6 workouts, form cues, variants)

## Next
- [ ] Programme rotation: when routine changes, regenerate PROGRAMME but keep IDs stable
- [ ] Size audit (currently ~106KB, budget 500KB)
- [ ] Consider service worker for true offline PWA

## Later
- [ ] Split_reps double progression banner (per-side status: L ready / R not yet)
- [ ] Sled history tracking across sessions (weight/lengths trends)

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
- [x] Spec amendment: 6 tracking types (weight_reps, reps_only, duration, completion, sled, weight_distance)
- [x] Unilateral support (split_weight, split_reps) with L/R inputs
- [x] Countdown timers + sled stopwatch with haptic/audio feedback
- [x] Variant system (tibialis, back extension, reverse squat, ham curl)
- [x] Programme corrections (sled unification, ATG split squat rename, back ext W6 fix)
- [x] Import parser expanded to handle all tracking types + variants
- [x] Date format with weekday (e.g. "Sun, 5 April 2026")
- [x] Import date timezone fix
- [x] Structured form cues (Setup/Do/Don't/You) for 10 new exercises
- [x] Scott curl variant toggle (Preacher bench / Spider curl)
- [x] Cable chop hi→lo / lo→hi alternation tracking with auto-flip
- [x] Exercise name corrections (Incline hammer curls)
- [x] isNew badge cleanup (back-extension, reverse-squat, pull-ups, dips)
