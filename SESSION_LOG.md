# Session Log

## 2026-04-11 (Session 7) — Session Timer Start/Stop + Home Page Cleanup

**Built:**
- Explicit **Start Session** button: timer no longer auto-starts when opening a workout — user presses "▶ Start Session" to begin timing
- **End Session** button (red): appears after exercise list, before notes section — locks `completedAt` and freezes the clock
- Frozen clock display: header shows "12:43 → 12:44 (1min) ✓" after ending session
- Last-exercise prompt: clicking "Done ←" on the final exercise asks "Last exercise done! End the session timer?"
- `finishSession()` preserves existing `completedAt` if timer was already ended manually
- Home page: shows last session date per workout (e.g., "Tue 8 Apr"), removed "~115 min · 17 exercises" subtitle

**Decisions:**
- Separated timer lifecycle (Start/End) from session finalization (Finish & Copy) — user can end timer then fill notes at leisure
- `State.startTimer()` and `State.endTimer()` are minimal functions that just set timestamps and save WIP
- Used `--red` CSS var for End Session button (not `--danger` which doesn't exist)
- Last exercise detection: finds highest non-fence index in workout exercises array

**Next:** Nothing queued

## 2026-04-10 (Session 6) — Session Timing + Manual Timer Override

**Built:**
- Live session clock on workout list view (`Started HH:MM · elapsed`) — ticks every second, auto-clears on route change
- Session duration on summary screen (`HH:MM → HH:MM (Xh Ymin)`)
- `**Time:**` line in markdown export (between Gym and Overall)
- Manual timer override: tap completed timer display → prompt for custom seconds value
- Timer helpers: `formatDuration(ms)` and `formatTimeOfDay(iso)` in Timer module
- ROADMAP: merged trend line graph into cross-exercise trend tracking item

**Decisions:**
- Used existing `startedAt`/`completedAt` ISO timestamps — no data model changes needed
- Session clock uses `window._sessionClockInterval` (global) so Views module can set it and Router module can clear it
- Timer override uses `prompt()` — simple and works on iOS Safari; can upgrade to inline input later if needed
- Time format: 24h (`en-GB`) to match Czech locale expectations

**Verified:** Session clock ticking, summary shows times, markdown export includes Time line, iPhone SE viewport (375×667) — clock fits header without crowding

**Next:** Trend line graph (Later in ROADMAP)

## 2026-04-09 (Session 5) — Per-Set Weight for Split Reps + W2 Reorder

**Context:** User mid-workout on W2, reported that split_reps exercises (ATG split squat, ATG lunge) only had one shared weight input but weight changes every set.

**Built:**
- Per-set weight input for `split_reps` exercises: each set row now has its own weight field alongside L/R reps (was a single shared "Weight (both sides)" input)
- New CSS grid layout for `.split-reps-row`: 6-column grid (set label, weight, L, L reps, R, R reps) with `.split-reps-header`
- New `.sr-weight-input` class for per-set weight DOM queries
- Backward compatible data loading: old format (`data.weight` as shared value) populates all per-set weight fields on render
- Updated all display paths: `formatExerciseDataCompact`, `formatSetsReadable`, markdown export, last-session detail, exercise row meta — all handle both old (shared `data.weight`) and new (per-set `sets[].weight`) formats
- W2 exercise reorder: RDL moved before ATG split squat, malto fence placed right after RDL

**Decisions:**
- Data format change: `{ weight: 10, sets: [{ repsL, repsR }] }` → `{ sets: [{ weight: 10, repsL, repsR }] }` — aligns with standard `weight_reps` per-set storage
- Deployed mid-workout to `main` via GitHub Pages (user request) — localStorage data preserved since it's browser-local
- Accepted RDL data loss on current WIP session due to index-based exercise storage shifting during reorder — user confirmed acceptable

**Lesson learned:**
- Reordering exercises mid-workout orphans WIP data (stored by array index, not exercise ID). Should warn user before pushing programme changes during active sessions.

**Next:**
- Nothing queued

**Built:**
- Merged "Dips" (W6) and "Weighted dips" (W2) into single `weighted-dips` exercise — shared history across workouts
- Added form cues to weighted dips matching pull-up pattern
- Fixed broken superset reference (W6 pullup-neutral → old `dips` ID)

**Decisions:**
- Single ID for dips across workouts = progression carries over (hit 3×8 in W2, auto-bumps in W6). Same pattern already used for RDL, incline press, etc.

**Audit findings:**
- Full review of all ~80 exercises across 6 workouts
- 11 compound exercises (+2.5kg step) — all correct
- 8 isolation exercises (+1kg step) — all correct
- ~20 ATG exercises (form-based, no auto-bump) — all correct
- ~15 no-progression exercises (duration, sled, completion, mobility) — all correct
- Only bug found was the superset link (fixed)

**Next:**
- Nothing queued — tracker is clean

---

## 2026-04-09 (Session 3) — Gym Tracking + Next Workout + UX Fixes

**Built:**
- Gym name tracking: dropdown selector on workout page (below Injuries/concerns), pre-selects last used gym, "Add new gym..." option. Stored in localStorage, included in markdown export (`**Gym:**`) and import. Default: Max Fitness Flora Praha.
- Next workout indicator on home screen: blue accent border + NEXT badge on the workout button that follows the last completed session (W1→W2→...→W6→W1). Hidden when a session is in progress.
- Sled exercise pre-fill: weight and lengths now pre-fill from last session (was the only exercise type missing pre-fill).
- Zero-clearing on input focus: all number inputs auto-select on tap, so typing instantly replaces pre-filled "0" without manual deletion.
- Exercise header readability: changed "W2 — 7/13" to "W2 — 7 out of 13".

**Decisions:**
- Gym selector placed after Injuries/concerns, before Finish button — bottom of workout page, low-friction location that doesn't slow down the main logging flow.
- Next workout logic uses simple cycling (last session's workoutId % 6 + 1) — no complex scheduling needed since the programme is sequential W1→W6.
- Sled pre-fill pulls directly from `lastEntry` (raw last session data) rather than the `Progression.getPreFill` system, since sled has no auto-bump logic.

**Next:**
- Test gym tracking end-to-end on iPhone (export round-trip, gym name persistence)
- Consider service worker for offline PWA

## 2026-04-08 (Session 2) — Export Fix + Exercise History + Form Cues Workflow

**Built:**
- Export bug fix: hardened per-set weight comparison with `parseFloat` + floating-point tolerance across all export paths (weight_reps, weight_distance, split_reps)
- Export: replaced square brackets `[]` with parentheses `()` to avoid Obsidian internal link rendering; import accepts both for backward compat
- Export: added "reps" to rep discrepancy flags ("3 sets above target 12 reps")
- Session detail view (`#/session/{index}`): tap any session in Settings to see readable per-set breakdown with numbered circle badges (replaces monospace export format)
- Exercise history page (`#/exercise/{exerciseId}`): shows canonical form cues + last 15 sessions with weights/reps/notes + "Copy all notes for AI review" button
- Inline on exercise detail: Reference & Cues section now shows user-edited cues, last session notes with date, and "View full history →" link
- Editable cues via localStorage (`gym-cues-{exerciseId}`) — built then removed UI buttons; cue editing will be done via Claude Code → GitHub Pages push workflow
- Finish session guard: scans all exercises for suspicious data before saving (0 weight with reps, reps with 0 weight, missing L/R reps)
- Cache-busting: HTTP no-cache meta tags + `APP_VERSION` constant with auto-update banner ("Update available — tap to reload")
- Exposed `resolveDisplayName` from Markdown module for Views reuse

**Decisions:**
- Form cues workflow: canonical cues updated via Claude Code editing FORM_CUES/PROGRAMME → push to GitHub Pages → auto-syncs to phone. In-app editing removed to avoid temptation; localStorage override API kept as internal fallback.
- Export format kept compact (`5×(6 @41, 8 @38) kg`) — optimized for Claude Chat analysis, not Obsidian readability. Obsidian is just the storage layer.
- Session detail uses readable per-set format (not export format) — `① 41kg × 6` with numbered badges
- APP_VERSION bump strategy: increment on each push, old cached versions detect mismatch and show update banner

**Next:**
- Service worker for true offline PWA
- Programme rotation when routine changes
- Batch form cue updates via Claude Code (user exports notes → AI review → update FORM_CUES)

## 2026-04-08 — Session 6: Peek View + Adjust Time

**Built:**
- Peek view: collapsible "Up next (N remaining)" section on exercise detail screen. Shows remaining exercises with number, name, sets×reps, superset badges, completion checkmarks, and malto fences. Tap any row to navigate directly.
- Adjust time buttons: −30s / +30s / +1min appear after any hold timer finishes (DONE state). Works for duration and completion types, both unilateral (L/R labeled) and regular. Also visible when returning to already-completed exercises.

**Decisions:**
- Peek view collapsed by default to keep exercise screen uncluttered
- Adjust buttons include −30s for corrections (not just +30s/+1min)
- Peek row tap auto-saves current exercise before navigating

**Next:**
- Form cues update workflow
- Service worker for true offline PWA

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

## 2026-04-08 (Session 5) — Post-Gym-Session UX Overhaul

**Context:** User's first real gym session with the app (W1, 7 April 2026). Exported session to Obsidian and reported multiple friction points.

**Built:**
- Export: per-set weight display when weights differ across sets (`5×[6 @41.3, 6 @40, 6 @38]`)
- Export: multi-line notes properly indented (4-space continuation) for Obsidian readability
- Export: empty/zero sets filtered out (was showing `5×[15,15,20,0,0]` for 3 actual sets)
- Export: blank line between exercises for clean Obsidian rendering
- Export: variant display name replaces bracket syntax — "Ham curl (seated)" not "Nordic curl [ham-curl-seated]" (brackets triggered Obsidian internal link rendering in purple)
- Export: rep discrepancy flags (`⬆️ 3 sets above target 12` / `⬇️ below target`)
- Import: new per-set weight format parser + variant label→exercise ID matching with auto-variant detection
- Checkmark: ✅ only on full exercise completion (all sets filled). Partial shows `2/5` in amber.
- Timer: display enlarged to 2.5rem (was 1.5rem) for gym readability
- Timer: green flash animation on `.timer-row` when hold timer reaches goal time
- Variant fallback rep scheme: ham curl (seated/prone) → `sets: 3, reps: '10-12', repRange: [10, 12]` overrides Nordic's 5×5
- `getEffectiveExercise()` helper threads variant overrides through renderers, autoSave, updateBanner, and export
- kg label: fixed hardcoded `placeholder="kg"` in split_weight and split_reps renderers (now uses `ex.weightLabel || 'kg'`)

**Verified:**
- Export round-trip: varying weights preserved, variant labels matched on import, notes indented
- Variant switching: Nordic curl → Ham curl (seated) shows 3 sets at 10-12 range (was 5 sets at 5)
- No JS errors in preview

**Decisions:**
- Per-set weight format: `reps @weight` inside brackets — compact, machine-parseable, import-compatible
- Variant names in export replace exercise name entirely (not appended or bracketed) — cleaner for Obsidian
- Deferred: peek view, adjust time post-exercise, form cues workflow, equipment variants for more exercises

**Next:**
- Peek view (upcoming exercises list while on exercise screen)
- Adjust time post-exercise (+30s / +1min buttons)
- Form cues update workflow (how to incorporate session notes into permanent cues)
- Equipment variant expansion (back squat: Smith vs free bar, hack squat: machine vs barbell)
