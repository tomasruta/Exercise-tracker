# Gym Workout Tracker — Build Spec

**For:** Claude Code implementation
**Author:** Claude (from conversation with Tomáš, 5 April 2026)
**Format:** Single self-contained HTML file, zero external dependencies
**Target:** Safari iOS (iPhone SE) + any desktop browser. Must work fully offline.

---

## Overview

A single-file workout tracker for a 6-workout ATG strength rotation. The user opens it on their phone at the gym, logs exercises, and exports session data as markdown. The HTML file itself syncs across devices via iCloud/Google Drive. Session history is imported via markdown paste.

**Key principle:** localStorage is the working database — it persists across sessions on the same device and holds all logged workout data indefinitely. Markdown is the backup/archive format — exported after sessions and stored in Google Drive for safety and Claude-readability. The HTML file contains the programme structure and canonical form cues baked in. If localStorage is ever lost (Safari data cleared, new phone), the markdown archive can be re-imported to restore everything.

---

## Pages / Views

### 1. Home

- 6 large tap-friendly buttons: **W1** through **W6**
- Each button shows the workout name (e.g., "W1 — Back Health + Posterior Chain")
- Below buttons: **"Load History"** button (opens a textarea to paste markdown from training-log.md)
- Below that: **"Export All Sessions"** button (exports everything in localStorage as markdown)
- Simple, clean. No clutter.

### 2. Workout View (per workout)

Shows the full exercise list for that workout in order. Each exercise is a tappable row showing:

- Exercise number and name
- Sets × Reps target
- **SS** badge (with paired exercise name) or **SEQ** badge
- If history is loaded: last weight used, shown in muted text
- If already logged this session: green checkmark + summary (e.g., "3×8 @ 15kg ✅")

**Special elements:**
- 🥤 **MALTO FENCE** — a visual divider between pre-fence and post-fence exercises. Make it obvious (colored bar, icon, text). Everything above = safe for prone/supine. Everything below = standing/seated only.
- **Superset pairs** — visually group SS pairs together (shared background color, bracket, or connecting line). When you tap one exercise in a pair, show both.

**At the bottom of the workout view:**
- **"How did it feel overall?"** — free text field (Wispr Flow target). Captures general session assessment.
- **"Injuries / concerns"** — separate free text field for any pain, tweaks, or things to flag.
- **"Finish & Copy Session"** — generates markdown for the whole session, copies to clipboard.

### 3. Exercise Detail (full screen)

Tapping any exercise opens a full-screen view. This is the main interaction surface during the workout.

**Top section — Reference (read-only):**
- Exercise name (large)
- Sets × Reps target with rep range clearly shown
- Flow: SS (with partner exercise name) or SEQ
- **Canonical form cues** — permanent tips baked into the HTML (see exercise data below)
- **Last session notes** — pulled from loaded history. Shows the most recent entry for THIS EXERCISE across ALL workouts (exercise-keyed, not workout-keyed). Includes date, workout number, weight, reps, and qualitative notes.

**Bottom section — Today's logging:**
- **Per-set logging rows** (number of rows = number of sets for this exercise):
  - Each row: [Set #] [Weight input (kg)] [Reps input] 
  - Pre-filled with last session's weight if history loaded
  - Tap-friendly number inputs, large enough for gym use with sweaty fingers
- **Notes field** — free text, full width, for qualitative feedback (Wispr Flow target). This is where the user speaks observations about form, feel, breakthroughs, problems.
- **Save** button — saves to localStorage, returns to workout view, shows ✅

**Double progression UI:**
- The rep range is shown clearly: e.g., "Target: 6-8 reps" for compounds, "Target: 8-12 reps" for isolation
- After logging all sets, if ALL sets hit the TOP of the rep range → show a green banner: **"✅ All sets at top — add 1-2.5kg next session"** (compounds) or **"✅ All sets at top — add weight"** (isolation)
- If any set is below the bottom of the range → show an amber note: **"⚠️ Below range — stay at this weight"**
- If mixed (some at top, some mid-range) → no banner, just show the numbers
- For ATG-specific exercises (back ext, QL, reverse squat, rhythm squat): show **"Add load when form is solid"** instead of rep-range progression

**Weight pre-fill logic (next session):**
- When opening an exercise, weight inputs auto-populate from the most recent session for that exercise (across ALL workouts, not just this workout number)
- If last session ALL sets hit top of rep range → pre-fill at **last weight + 2.5kg** (compounds) or **last weight + 1kg** (isolation). Show a subtle note: "Auto-bumped from [old]kg"
- If last session did NOT hit top → pre-fill at **same weight as last time**
- User can always override the pre-filled weight
- Rep inputs are left empty (user must enter each set's actual reps)

### 4. Session Summary / Export

After tapping "Finish & Copy Session":
- Shows a clean summary of everything logged
- Date, workout number, duration (if we track start time — optional)
- Each exercise: sets × reps × weight + notes
- "How did it feel overall?" text
- "Injuries / concerns" text
- **"Copy as Markdown"** button — formats everything as markdown and copies to clipboard
- **"Share"** button — triggers the native iOS/desktop share sheet (via `navigator.share()` API). User can save directly to Google Drive, iCloud Files, Notes, or any app. This is the primary backup path — no paste required.
- **"Save & Close"** — keeps in localStorage, returns to home

**Important:** Exporting/sharing is a BACKUP step, not required for the app to work. All data persists in localStorage between sessions on the same device. The export creates an archive in the user's Google Drive Health folder (`training-log.md`) for safety and for Claude to read later.

---

## Data Architecture

### Baked into HTML (programme structure)

The exercise data below should be embedded as a JavaScript object in the HTML file. This is the programme — it rarely changes (only when the programme is updated, which means regenerating the HTML).

```javascript
const programme = {
  workouts: [
    {
      id: "W1",
      name: "Back Health + Posterior Chain",
      subtitle: "Weekend Long Session — ~115 min",
      exercises: [
        {
          id: "backward-treadmill",
          name: "Backward treadmill",
          sets: 1,
          reps: "2 min",
          flow: "SEQ",
          position: "Standing",
          repRange: null, // no progression tracking
          progressionType: null,
          formCues: "Slow, controlled. Focus on knee tracking over toes.",
          notes: ""
        },
        {
          id: "reverse-sled",
          name: "Reverse sled / deadmilling",
          sets: 1,
          reps: "8 lengths",
          flow: "SEQ",
          position: "Standing",
          repRange: null,
          progressionType: null,
          formCues: "Stay low. Knees forward. VMO engagement requires bent-knee position throughout.",
          notes: ""
        },
        {
          id: "tibialis-raise",
          name: "Tibialis raise",
          sets: 2,
          reps: "15-20",
          flow: "SEQ",
          position: "Seated",
          repRange: [15, 20],
          progressionType: "atg",
          formCues: "",
          notes: ""
        },
        {
          id: "seated-calf-raise",
          name: "Seated calf raise",
          sets: 1,
          reps: "15-20",
          flow: "SEQ",
          position: "Seated",
          repRange: [15, 20],
          progressionType: "atg",
          formCues: "Seated = targets soleus (knee bent). Fixed assignment: W1 + W4 = seated, W3 + W6 = SL standing (gastrocnemius).",
          notes: "Mar 25: standing on squat machine didn't work well, couldn't get right impulse. Only 25kg. Go harder."
        },
        {
          id: "couch-stretch",
          name: "Couch stretch",
          sets: 1,
          reps: "60/60s",
          flow: "SEQ",
          position: "Kneeling",
          repRange: null,
          progressionType: null,
          formCues: "",
          notes: ""
        },
        {
          id: "internal-hip-db-lift",
          name: "Internal hip dumbbell lift",
          sets: 1,
          reps: "20/20",
          flow: "SEQ",
          position: "Side-lying",
          repRange: null,
          progressionType: null,
          formCues: "",
          notes: ""
        },
        {
          id: "loaded-butterfly",
          name: "Loaded butterfly",
          sets: 1,
          reps: "20",
          flow: "SEQ",
          position: "Seated",
          repRange: null,
          progressionType: null,
          formCues: "",
          notes: ""
        },
        {
          id: "pigeon-stretch",
          name: "Pigeon/piriformis stretch",
          sets: 1,
          reps: "20/20",
          flow: "SEQ",
          position: "Bench",
          repRange: null,
          progressionType: null,
          formCues: "",
          notes: "Mar 25: Definitely a lot of improvement now that doing it more often."
        },
        {
          id: "pullover",
          name: "Pullover",
          sets: 3,
          reps: "10",
          flow: "SS",
          supersetWith: "trap-3-raise",
          position: "Supine",
          repRange: [10, 12],
          progressionType: "atg",
          formCues: "Put plates under bench for more range.",
          notes: "Mar 25: 12.5kg. Bench was wobbly — do better setup next time."
        },
        {
          id: "trap-3-raise",
          name: "Trap-3 raise",
          sets: 3,
          reps: "8",
          flow: "SS",
          supersetWith: "pullover",
          position: "Prone bench",
          repRange: null,
          progressionType: "atg",
          formCues: "",
          notes: ""
        },
        {
          id: "back-extension-w1",
          name: "Back extension",
          sets: 3,
          reps: "12",
          flow: "SS",
          supersetWith: "reverse-squat-w1",
          position: "Prone bench",
          repRange: null,
          progressionType: "atg",
          formCues: "Keep spine neutral. Look in mirror to check back is straight. Feel activation in lower back, not just hamstrings.",
          notes: "Mar 17: Getting much better with neutral spine. Feeling light activation in lower back — good sign. Mar 28: Mirror really helps."
        },
        {
          id: "reverse-squat-w1",
          name: "Reverse squat (cable)",
          sets: 3,
          reps: "20",
          flow: "SS",
          supersetWith: "back-extension-w1",
          position: "Supine-ish",
          repRange: null,
          progressionType: "atg",
          formCues: "Check that spine is NOT in imprint — should feel lower back muscles, not abs. If abs dominate, drop weight.",
          notes: "Mar 17: Started 18kg too much, 15kg also hard, 13kg still good impulse. Accept weakness, build from scratch. Mar 28: Struggled again, had to go to 13kg. Be careful."
        },
        {
          id: "glute-bridge",
          name: "Glute bridge/hip thrust",
          sets: 3,
          reps: "15",
          flow: "SEQ",
          position: "Supine bench",
          repRange: null,
          progressionType: "atg",
          formCues: "Shoulders on bench. Drive up through heels. 2-second squeeze at top. Source: Novotný #4.",
          notes: "",
          isNew: true
        },
        {
          id: "ql-extension-w1",
          name: "QL extension",
          sets: 3,
          reps: "10/10",
          flow: "SEQ",
          position: "Sideways on bench",
          repRange: null,
          progressionType: "atg",
          formCues: "Bottom foot must be fully settled, not lifting. Torso drops below horizontal — must be pre-fence.",
          notes: "Mar 25: Beautiful work. First round harder than second. Always check bottom foot. Mar 30: 8 reps maybe too much — moving lumbar. Try 7 next time."
        },
        // === MALTO FENCE ===
        {
          id: "malto-fence-w1",
          name: "🥤 MALTO FENCE",
          isFence: true,
          fenceNote: "Nothing prone/supine/inverted below this line"
        },
        {
          id: "nordic-curl",
          name: "Nordic curl",
          sets: 5,
          reps: "5",
          flow: "SS",
          supersetWith: "back-squat",
          position: "Floor/anchor",
          repRange: [5, 5],
          progressionType: "compound",
          formCues: "Try actual nordics at Max Fitness Flora — look for anchor point. Ham curl (seated) is fallback only.",
          notes: "Mar 30: Ham curl sub — barely feeling impulse. Need to try actual nordics."
        },
        {
          id: "back-squat",
          name: "Back squat",
          sets: 5,
          reps: "6-8",
          flow: "SS",
          supersetWith: "nordic-curl",
          position: "Standing",
          repRange: [6, 8],
          progressionType: "compound",
          formCues: "Double progression: all sets at 8 reps → add 1-2.5kg → drop to 6.",
          notes: "Mar 30: Only got to 50kg. Even empty bar (20kg) was feeling quads. Going careful — glad I put in the work."
        },
        {
          id: "farmers-carry",
          name: "Farmer's carry",
          sets: 3,
          reps: "40m",
          flow: "SEQ",
          position: "Standing",
          repRange: null,
          progressionType: null,
          formCues: "Heavy DBs, shoulders packed, tall spine. 20-25kg/hand to start. Source: Dan John.",
          notes: "",
          isNew: true
        }
      ]
    }
    // W2 through W6 follow same structure — see full exercise data appendix below
  ]
};
```

**NOTE TO CLAUDE CODE:** The above shows the complete W1 data structure as a template. The remaining workouts (W2–W6) should follow the identical structure. Full exercise data for all 6 workouts is provided in the appendix at the end of this spec. Each exercise has an `id` that is CONSISTENT across workouts — e.g., "back-extension" is the same exercise in W1, W3, and W6, so history lookup works across workouts.

### Canonical Form Cues (baked in)

These are extracted from the user's training log and programme design. They go into the `formCues` field:

| Exercise | Canonical Form Cues |
|---|---|
| Backward treadmill | Slow, controlled. Focus on knee tracking. |
| Reverse sled | Stay low. Knees forward. VMO = bent-knee throughout. |
| Seated calf raise | Knee bent ~90° = isolates soleus. Fixed: W1 + W4 seated, W3 + W6 SL standing. |
| Couch stretch | — |
| Pullover | Put plates under bench for range. |
| Back extension | Neutral spine. Mirror to check. Feel lower back, not just hamstrings. Don't squeeze/overextend at top. |
| Reverse squat (cable) | NOT in imprint. Lower back muscles, not abs. If abs dominate → drop weight. |
| Glute bridge | Shoulders on bench. Drive through heels. 2s squeeze top. (Novotný #4) |
| QL extension | Bottom foot fully settled. Torso drops below horizontal. |
| Nordic curl | Try actual nordics. Ham curl = fallback. |
| Back squat | Double progression 6-8. |
| Farmer's carry | Shoulders packed, tall spine. 20-25kg/hand. |
| Patrick step-up | — |
| Jefferson curl | Use slant! Not first thing AM. |
| ATG split squat | Double progression 6-8/side. |
| RDL | Hip hinge, soft knees, FLAT BACK. Stop before lumbar rounds. Form priority — maintain lordosis. |
| Weighted pull-ups | Over/under/neutral grip rotation. |
| Scott curl (Zottman) | Incline bench. Curl supinated, rotate pronated at top, 3s eccentric down. 5-7kg start. |
| Petersen step-up | Optimise for stability. Improve ROM. Assisted OK at first. |
| Lateral band walk | Mini-band above ankles. Slight squat position. 15 steps each way. (Novotný #12) |
| Cossack squat | Wide stance. Shift laterally. Full depth one side. BW to start. |
| Hack squat | Barbell Hackenschmidt. Can lift heels off ground. Don't need steep slant board. |
| Shoulder press | Double progression 8-12. |
| Powell raise | FORM RESET: 1-2kg, strict, 3s eccentric. Brief prone post-fence — pause malto sipping. |
| External rotation | — |
| OH tricep ext | Cable rope, face away, extend overhead, 3s eccentric. ~10kg start. |
| Reverse nordics | Kneeling on mat. Tips of feet up. No equipment needed. |
| Front squat | Wrist CARs during rest! Figure out foot positioning if using Smith machine. Try without Smith next time. |
| Ham curl (seated) | — |
| Incline DB press | Inclined not flat — OK post-fence. Rest back properly on bench for stable push. |
| Hammer curls | Standing, neutral grip throughout. 7-9kg start. |
| Poliquin step-up | 3 plates height. Put leg further away. Go down with bum to feel it around knee. |
| ATG lunge (walking) | Double progression on load. Don't rush. Stay in stretches. Control matters. |
| Full range row | Form is tricky — back curls up. May need different version. Brief prone — pause malto. |
| Rhythm squat | 35kg sweet spot. 40kg = trouble getting bar up/down. |
| KOT/Sissy squat | Watch form video first! |
| Band pull-apart | Face height. Elbows out+back. Squeeze scaps. |
| Half-kneel cable chop | One knee down. Cable high. Diagonal across body. Alternate high→low / low→high each session. (Novotný #3 / Galpin) |
| Pull-ups (BW) | — |
| Dips (BW) | — |

### Historical Notes (from training log, baked in as initial data)

These go into the `notes` field per exercise. They represent the user's most recent qualitative observations. See the W1 data structure above for format. Full set provided in appendix.

### Session Data (localStorage — temporary)

```javascript
// Structure for a logged session
{
  date: "2026-04-08",
  workout: "W1",
  exercises: [
    {
      id: "back-squat",
      sets: [
        { weight: 50, reps: 6 },
        { weight: 50, reps: 7 },
        { weight: 50, reps: 7 },
        { weight: 50, reps: 8 },
        { weight: 50, reps: 8 }
      ],
      notes: "Felt stronger today. Quads not as sore as last time."
    }
  ],
  overall: "Good energy. Took long breaks. Evening slot worked well.",
  injuries: "Left hamstring slightly tight during RDL.",
  exportedToMarkdown: false
}
```

### Markdown Export Format

When user taps "Finish & Copy Session", generate this format:

```markdown
## 8 April 2026 — Workout 1 (Back Health + Posterior Chain)

**Overall:** Good energy. Took long breaks. Evening slot worked well.
**Injuries:** Left hamstring slightly tight during RDL.

- **Back squat** — 5×[6,7,7,8,8] @ 50kg
  - Felt stronger today. Quads not as sore as last time.
- **Nordic curl** — 5×[5,5,5,5,5] @ BW (ham curl sub)
  - Still can't find anchor for actual nordics.
- **Farmer's carry** — 3×40m @ 22kg/hand
  - Grip was limiting factor.

[... all exercises with data ...]
```

### Markdown Import Format

The "Load History" function should parse markdown in the above format. It needs to:
1. Accept pasted text (textarea)
2. Parse dates, workout numbers, exercise names, weights, reps, notes
3. Store parsed history in localStorage under a separate key
4. When showing exercise detail, search history for the most recent entry matching that exercise ID/name
5. Show it as "Last session" on the exercise detail page

The parser should be forgiving — exercise names might have slight variations. Match on key words (e.g., "back squat" matches "Back squat", "Back Squats", etc.).

---

## Double Progression Logic

Built into the exercise detail view. Three types:

### Compound (repRange [6, 8])
- Log all sets
- If ALL sets ≥ 8 reps → green banner: **"✅ All sets at 8 — add 1-2.5kg next session"**
- If ANY set < 6 → amber: **"⚠️ Below range — consider dropping weight"**
- Otherwise → no banner, just show numbers

### Isolation (repRange [8, 12])
- Same logic with 8-12 range
- Green: **"✅ All sets at 12 — add weight next session"**
- Amber if below 8

### ATG-specific (progressionType "atg")
- No rep-range progression
- Instead show: **"Add load when form is solid"**
- No auto-nudges

### No tracking (progressionType null)
- Stretches, treadmill, sled — no progression UI
- Just log if user wants to, no banners

---

## UI/UX Requirements

### General
- **Mobile-first.** iPhone SE screen (375×667 logical pixels). Everything must be tappable with a thumb.
- Large tap targets (minimum 44×44px per Apple HIG)
- High contrast. Readable in gym lighting.
- Dark mode support (prefers-color-scheme media query)
- No scrolling needed to see the current exercise during logging — the log inputs should be visible without scrolling past form cues
- System font stack (no external fonts)

### Workout View
- Superset pairs visually connected (bracket, background color, or connecting line)
- Malto fence = prominent colored divider bar with 🥤 icon
- Exercises already logged this session show ✅ with brief summary
- Tapping any exercise → full-screen exercise detail

### Exercise Detail
- Form cues section collapsible (expanded by default on first visit, collapsed on return visits)
- Last session notes always visible
- Number inputs: type="number" with large font, step buttons, easy to increment
- Notes field: multiline, auto-expanding, placeholder text "Speak or type notes..."
- "Save" button fixed to bottom of screen

### Navigation
- Back button always visible (top-left)
- Workout number always shown in header (e.g., "W1 — Exercise 7/17")
- Swipe between exercises (optional — nice to have, not essential)

### Colors / Theming
- Clean, minimal. No aggressive colors.
- Green for progression nudges
- Amber for warnings
- Blue/teal for superset badges
- Red for malto fence
- Support both light and dark mode

---

## Exercise Data Appendix

### Complete exercise list by workout

Full programme data is in the file `strength-routine-2026-04-05.md` (provided alongside this spec). Claude Code should parse that file to build the complete `programme` object.

Key structural notes:
- Exercise IDs must be consistent across workouts (e.g., `back-extension` is the same in W1, W3, W6)
- `supersetWith` references the paired exercise's ID
- `isFence: true` marks the malto fence divider (not a real exercise)
- `isNew: true` marks exercises new in this programme version (can show 🆕 badge)
- All exercises use double progression unless `progressionType` is null or "atg"

### Superset pairs (14 total)

| Workout | Exercise A | Exercise B |
|---|---|---|
| W1 | pullover | trap-3-raise |
| W1 | back-extension | reverse-squat |
| W1 | nordic-curl | back-squat |
| W2 | weighted-pull-ups | weighted-dips |
| W3 | back-extension | reverse-squat |
| W3 | external-rotation | oh-tricep-ext |
| W4 | pullover | ql-extension |
| W4 | front-squat | ham-curl-main |
| W4 | pull-ups | incline-press |
| W5 | full-range-row | incline-press |
| W6 | back-extension | reverse-squat |
| W6 | band-pull-apart | external-rotation |
| W6 | pull-ups | dips |
| W6 | cable-chop | oh-tricep-ext |

---

## Implementation Notes

1. **Single file.** Everything in one `.html` file. CSS inline or in `<style>`, JS inline or in `<script>`. No imports, no CDN, no build step.

2. **Size budget.** Keep under 500KB total. The programme data is small (~5KB as JSON). The rest is UI code.

3. **localStorage keys:**
   - `gym-sessions` — ALL logged sessions (array of session objects). This is the working database. Persists indefinitely on the same device.
   - `gym-settings` — any user preferences (dark mode, etc.)
   - **No separate "current session" key needed** — the current session is just the most recent entry in `gym-sessions` with `completed: false`.

4. **localStorage persistence:** Safari localStorage on iOS persists across app restarts, phone reboots, and updates. It is only cleared if: (a) user manually clears Safari data, (b) iOS evicts under extreme storage pressure (very rare for home screen web apps), or (c) user gets a new phone. Capacity is ~5-10MB, which holds hundreds of sessions easily.

5. **Backup strategy:** The "Share" button on session export triggers `navigator.share()` on iOS (native share sheet). User can save the markdown directly to Google Drive, iCloud Files, or any app. If `navigator.share()` is unavailable (desktop), fall back to "Copy to Clipboard" button. The markdown archive in Google Drive is the disaster recovery path — if localStorage is ever lost, user can "Load History" and paste the full archive to restore.

6. **Error handling.** If localStorage is full or unavailable, show a clear message. Never silently lose data.

7. **Future-proofing.** The programme structure will change every ~2 months. The HTML file will be regenerated. Session history in localStorage carries over (exercise IDs stay consistent). Markdown archive is programme-independent.

8. **Testing.** Open on iPhone Safari in airplane mode. Log a full W1 session. Close Safari. Reopen. Verify data persists. Export markdown. Clear localStorage. Import markdown via "Load History". Verify everything restores. That's the acceptance test.

---

## Files to Reference

- `strength-routine-2026-04-05.md` — the locked programme (exercise order, sets, reps, supersets, fence positions)
- `programme-log.md` — design decisions and rationale
- Training log notes (in this spec under "Historical Notes") — pre-populate form cues and last session data
