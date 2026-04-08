# ATG Gym Workout Tracker — Roadmap

## Now
(nothing active)

## Next
- [ ] Consider service worker for true offline PWA
- [ ] Cache-busting for GitHub Pages updates (version query param or service worker)

## Ideas — Form Cues Workflow
- [ ] **Preferred flow**: Update canonical cues via Claude Code → push to GitHub Pages → auto-syncs to phone. Better than in-app editing because cues live in source of truth (HTML file), not scattered in localStorage. User exports session notes to Obsidian, reviews with AI, then asks Claude Code to update cues in FORM_CUES/PROGRAMME constants.
- [ ] In-app editable cues (already built) remain as fallback for quick gym-side tweaks
- [ ] Bulk cue import: paste structured cues from AI review into Claude Code to update multiple exercises at once

## Later
- [ ] Programme rotation: when routine changes, regenerate PROGRAMME but keep IDs stable
- [ ] Split_reps double progression banner (per-side status: L ready / R not yet)
- [ ] Cross-exercise trend tracking (idea: visual progression across sessions)
- [ ] Equipment variant selector for more exercises (back squat: Smith vs free bar, hack squat: machine vs barbell)
- [ ] Variant prefillReps should match variant's rep range (currently inherits base exercise's prefill)

## Ideas
- [ ] Add to Home Screen on iPhone SE (user will do manually during AppBlock window)

## Done
- [x] Export bug fix: robust per-set weight comparison with parseFloat + floating-point tolerance
- [x] Session data viewer: tap session in Settings → per-exercise breakdown with raw data
- [x] Exercise history page (#/exercise/{id}): cues + progression + notes + "Copy notes for AI review"
- [x] Editable cues: localStorage override for form cues with Edit/Save/Reset
- [x] Inline last session notes + "View full history →" link on exercise detail page
- [x] resolveDisplayName exposed from Markdown module for reuse
- [x] Full tracker built — single HTML file, all 6 workouts, ~80 exercises
- [x] Hash-based SPA routing, dark mode, iOS PWA meta tags
- [x] Exercise detail with weight/reps inputs, auto-bump, progression banners
- [x] Markdown export (single session + bulk) and import with fuzzy matching
- [x] Session history with per-session export tracking + delete
- [x] Unexported session warning banner on home screen
- [x] Settings page with individual session export
- [x] GitHub Pages deployment: tomasruta.github.io/Exercise-tracker/tracker.html
- [x] Crash recovery via `gym-session-wip` auto-save
- [x] Spec amendment: 6 tracking types (weight_reps, reps_only, duration, completion, sled, weight_distance)
- [x] Unilateral support (split_weight, split_reps) with L/R inputs
- [x] Countdown timers + sled stopwatch with haptic/audio feedback
- [x] Variant system (tibialis, back extension, reverse squat, ham curl, scott curl, nordic curl)
- [x] Programme corrections (sled unification, ATG split squat rename, back ext W6 fix)
- [x] Import parser expanded to handle all tracking types + variants
- [x] Date format with weekday (e.g. "Sun, 5 April 2026")
- [x] Import date timezone fix
- [x] Structured form cues (Setup/Do/Don't/You) for 10 new exercises
- [x] Scott curl variant toggle (Preacher bench / Spider curl)
- [x] Cable chop hi→lo / lo→hi alternation tracking with auto-flip
- [x] Exercise name corrections (Incline hammer curls)
- [x] isNew badge cleanup (back-extension, reverse-squat, pull-ups, dips)
- [x] Pull-ups split into 3 grip-specific exercises (overhand W2, underhand W4, neutral W6)
- [x] Nordic curl variant toggle (nordic / ham curl seated / ham curl prone)
- [x] Ham curl activation variant (W4)
- [x] QA fixes: band-pull-apart progressionType, sl-calf-raise prefillReps, cable-pancake progressionType
- [x] iPhone SE QA: sled stopwatch button enlarged to 48×44px tap target
- [x] Reference & Cues collapsed by default
- [x] Completion checkmark appears immediately on tap
- [x] Save button replaced with auto-save indicator + "Done ←"
- [x] Weight fields pre-fill with 0 (bodyweight convention)
- [x] Delete individual sessions from history
- [x] Stretch hold timer: count-up timer records actual hold time (was preset countdown only)
- [x] Markdown export/import round-trip for hold times: `L✅(52s) R✅(65s)`
- [x] Post-gym-session UX overhaul (Session 5): export formatting, checkmark logic, timer size, variant rep schemes
- [x] Export: per-set weights, multi-line notes indentation, zero set filtering, Obsidian-friendly formatting
- [x] Export: variant display names replace bracket syntax, rep discrepancy flags
- [x] Import: per-set weight format + variant label matching (round-trip verified)
- [x] Checkmark: exercise-level ✅ only on full completion, partial shows "2/5" in amber
- [x] Timer: 2.5rem display + green flash animation at target time
- [x] Variant fallback rep scheme: ham curl (seated/prone) → 3×10-12 instead of Nordic's 5×5
- [x] kg label consistency in split_weight and split_reps renderers
- [x] Peek view: collapsible "Up next" list on exercise detail screen with remaining exercises, completion status, tap-to-navigate
- [x] Adjust time: −30s / +30s / +1min buttons after timed exercises (duration + completion, unilateral + regular)
