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
