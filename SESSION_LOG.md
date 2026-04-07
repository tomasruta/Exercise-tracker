# Session Log

## 2026-04-06 — Initial Build + Session Management

**Built:**
- Full single-file tracker (`tracker.html`, ~62KB) with all 6 ATG workouts
- Home screen with 6 workout buttons, settings, and unexported session warning
- Exercise detail view: weight/reps inputs, auto-bump from last session, progression banners (green/amber)
- Markdown export (copy + native share) and import with fuzzy exercise name matching
- Session history on settings page with individual session export + export tracking
- Crash recovery: WIP session auto-saved to localStorage on every input change
- Dark mode via `prefers-color-scheme`, iOS PWA meta tags for full-screen Add to Home Screen
- GitHub Pages deployment (repo made public)

**Decisions:**
- GitHub Pages over iCloud Drive — localStorage is per-device anyway, so file sync ≠ data sync. Markdown export to Google Drive is the backup path.
- PWA via Add to Home Screen bypasses AppBlock (which blocks Safari/Vivaldi but not home screen web apps)
- Exercise IDs without workout suffixes — stable contract for cross-workout history lookup
- Export tracking per-session (`exported` flag) to avoid duplicate exports. Bulk export moved to settings.
- Skipped post-session export reminder prompt (user preference)

**Next:**
- User has new handover from Claude Chat (`gym-tracker-spec-amendment.md`) with significant rework requirements
- Need to update programme data (sled changes, ATG split squat rename)
- Better exercise breakdowns needed

## 2026-04-07 — Verification + Import Fix + Date Format

**Built:**
- Expanded markdown import parser to handle all 6 tracking types (was only weight×reps before — ~40% of exercises couldn't round-trip)
- Added import support for: completion (bilateral/unilateral), sled, weight_distance, split_weight, split_reps, variants
- Fixed timezone bug in import date parsing (UTC shift caused off-by-one day)
- Added weekday abbreviation to all date displays ("Sun, 5 April 2026" instead of "2026-04-05")
- Applied `formatDate` consistently to last-session banner and WIP session display

**Verified (browser preview, no JS errors):**
- All 6 tracking types render correctly with proper inputs
- Unilateral split_weight (QL extension): L/R rows with independent weight+reps
- Unilateral split_reps (ATG split squat): shared weight, L/R reps
- Completion+unilateral+timer (Couch stretch): L/R toggles with 1:00 countdowns
- Variant pills (Tibialis raise): switches between reps_only and weight_reps
- Sled: length distance field, KG/lengths/time, stopwatch button
- Weight_distance (Farmer's carry): kg/hand + meters columns
- Import round-trip: 10 exercises imported with correct data structures

**Decisions:**
- Previous session's plan file was gone — rebuilt verification checklist from scratch
- Date format uses `en-GB` locale with `weekday: 'short'` → produces "Tue, 7 April 2026" (comma is locale default)

**Next:**
- Add to Home Screen on iPhone SE
- Better exercise breakdowns (form cues, set structure)
- Split_reps double progression banner (per-side L/R status)

## 2026-04-07 (Session 2) — Spec Amendment Session 5

**Built:**
- Structured form cues for 10 new exercises with **Setup / Do / Don't (❌) / You** sections
- Scott curl variant toggle: Preacher bench (default) / Spider curl — form cues change per variant
- Cable chop alternation tracking: 🔄 Hi→Lo / Lo→Hi display, tappable toggle, auto-flips on W6 completion
- New `FORM_CUES` constant with structured data, `getStructuredCues()` resolver (variant-aware)
- Renamed "Hammer curls" → "Incline hammer curls" (W4, W5)
- Removed isNew badge from: back-extension, reverse-squat, pull-ups, dips (user confirmed these aren't new)
- Saved `gym-tracker-spec-amendment-session5.md` to project root

**Decisions:**
- Structured cues stored as object arrays (`setup[]`, `exec[]`, `mistakes[]`, `you[]`) — cleaner than parsing formatted strings
- For variant exercises (scott-curl), FORM_CUES uses variant ID as sub-key to resolve the right cues
- Old plain-text `formCues` on exercises cleared when structured cues replace them — avoids duplication
- Chop direction stored in `gym-chop-direction` localStorage key, flips automatically on W6 finish
- Form cue rendering falls back to plain text for exercises without structured cues (non-breaking)

**Next:**
- Real-device testing on iPhone SE Safari
- Programme rotation (stable IDs when routine changes)
- Split_reps double progression banner

## 2026-04-07 (Session 3) — Final Audit + iPhone SE QA + UX Polish

**Built:**
- Pull-ups split into 3 grip-specific exercises: overhand (W2), underhand/chin-up (W4), neutral (W6) — each with independent weight/rep history
- Nordic curl variant toggle: Nordic curl / Ham curl (seated) / Ham curl (prone)
- Ham curl activation (W4 #6) now shares seated/prone variant toggle
- QA fixes from Claude Chat: band-pull-apart `progressionType: 'atg'`, sl-calf-raise `prefillReps: 12`, cable-pancake `progressionType: 'atg'`, removed dead `showNotes` variable
- Sled stopwatch button enlarged: own grid column, 48×44px tap target (was 13×22px)
- Reference & Cues collapsed by default — less clutter, tap to expand
- Completion checkmark (✅) now appears immediately on tap (was only on re-render)
- Big "Save ✓" button replaced with subtle "Auto-saved" indicator + smaller "Done ←"
- Weight fields pre-fill with 0 instead of blank (bodyweight convention)
- Delete individual sessions from Settings > Session History
- gstack upgraded to v0.15.16.0, bun installed

**QA verified (code + browser):**
- All 3 pull-up grips render correctly with independent superset references
- Nordic curl shows 3 variant pills
- Export/import round-trip preserves split_weight, notes, chop direction
- Chop direction only flips on successful W6 completion (not discard)
- Auto-bump split_reps requires BOTH sides hit top on ALL sets
- Sled length persists across workouts (single global localStorage key)
- File size: 117KB (budget 500KB)
- iPhone SE 375×667 viewport: all inputs properly sized, tap targets ≥44px

**Decisions:**
- iPhone SE 3rd gen (MMX83LL/A, 375×667) is the primary test device — saved to global CLAUDE.md
- GitHub Pages confirmed as hosting (rarely down, PWA caches offline, auto-updates on push)
- Auto-save is the default — Save button was confusing since data persists on every input change

**Next:**
- Stretch timer: record actual hold time for stretches (user request)
- Add to Home Screen on iPhone SE
- Programme rotation when routine changes

## 2026-04-07 (Session 4) — Stretch Hold Timer

**Built:**
- Stretch/duration timers now count UP from `0:00` with goal shown alongside (`0:32 / 1:00`)
- Timer beeps + vibrates at goal time but keeps running — user taps STOP when done
- Actual hold time saved as `timeL`/`timeR`/`time` (seconds) alongside done flags
- Affects: Couch stretch (60s L/R), Big toe stretch (45s), Calf stretch (45s L/R), Backward treadmill (120s)
- Markdown export: `L✅(52s) R✅(65s)` or `✅(48s)` — import round-trips correctly
- Session summary shows formatted times next to checkmarks
- Navigation safety: auto-stops and saves elapsed time if user taps Back mid-timer
- Backward compatible: old sessions without time data display normally

**Decisions:**
- Count UP (not down) — more intuitive for tracking actual hold duration, shows real progress
- Don't auto-stop at goal — stretches benefit from going past the preset, and actual time is the valuable data
- Programme rotation deferred — not a quick cleanup, needs data migration logic
- Sled history trends removed from roadmap — user prefers tracking in markdown exports
- "Add to Home Screen" moved to Ideas — user will handle manually

**Next:**
- Service worker for true offline PWA
- Split_reps double progression banner (per-side L/R status)
- Cross-exercise trend tracking (idea)
