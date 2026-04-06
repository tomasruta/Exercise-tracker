# Gym Tracker Spec — Amendment #1

**Date:** 6 April 2026
**Applies to:** `gym-tracker-spec.md` + current HTML tracker
**Purpose:** Fix exercise tracking types, add unilateral support, timers, variants, rep pre-fill, and programme corrections

---

## 1. New Exercise Properties

Add these fields to exercise objects in the `programme` data structure:

```javascript
// UNILATERAL TYPE — how L/R sides are tracked
// 'split_weight' = each side gets own kg + reps inputs (e.g. QL extension — could hold different DB each side)
// 'split_reps' = one shared weight, but L/R reps tracked separately (e.g. ATG split squat — same DBs both hands, reps per leg)
// false or absent = bilateral (default)
unilateral: 'split_weight' | 'split_reps' | false

// TRACKING TYPE — what inputs to show per set
// 'weight_reps' = [kg] × [reps] (default)
// 'reps_only' = [reps] only, no weight input (e.g. wall tibialis raise)
// 'duration' = countdown timer, auto-marks ✅ on completion
// 'completion' = just a ✅ toggle (stretches held for fixed time)
// 'sled' = [kg] × [lengths] × [time mm:ss] + persistent [length_distance] field
// 'weight_distance' = [kg/hand] × [meters] (farmer's carry)
trackingType: 'weight_reps' | 'reps_only' | 'duration' | 'completion' | 'sled' | 'weight_distance'

// PRE-FILLED REPS — auto-populate reps input
// If the exercise has fixed reps (e.g. "12", "20", "5"), set this to that number.
// If the exercise has a rep range (e.g. "6-8"), set to null — user must enter actual.
// User can always tap and change the pre-filled value.
prefillReps: number | null

// VARIANTS — switchable exercise variations
// Array of variant objects with different tracking behaviour.
// Selected variant persists in localStorage key: `gym-variant-{exerciseId}`
// When user switches variant, the input UI changes accordingly.
// null or absent = no variants (default)
variants: [
  { id: string, label: string, trackingType: string, isDefault: boolean }
] | null

// CUSTOM LABELS — override placeholder text on inputs
repsLabel: 'reps' | 'meters' | 'steps' | 'lengths'  // default: 'reps'
weightLabel: 'kg' | 'kg/hand'  // default: 'kg'

// TIMER DURATION — for trackingType 'duration' and 'completion'
// Duration in seconds for the countdown timer.
timerSeconds: number | null
// For unilateral duration exercises, the timer runs once per side (L then R).
```

---

## 2. Unilateral Exercise UI

### Type A: `unilateral: 'split_weight'`

Each side gets **independent weight AND reps** inputs:

```
Set 1:
  L: [kg] × [reps]
  R: [kg] × [reps]
Set 2:
  L: [kg] × [reps]
  R: [kg] × [reps]
```

Pre-fill weight from last session per side. Pre-fill reps if `prefillReps` is set.

**Exercises:** ql-extension, internal-hip-db-lift, patrick-step-up, petersen-step-up, poliquin-step-up, sl-calf-raise, cossack-squat, cable-chop

### Type B: `unilateral: 'split_reps'`

One shared weight input, but **separate reps per side**:

```
Weight: [kg] (same both sides)
Set 1:  L [reps]  R [reps]
Set 2:  L [reps]  R [reps]
```

Pre-fill weight from last session (shared). Pre-fill reps if `prefillReps` is set (same value both sides).

**Exercises:** atg-split-squat, atg-lunge

### Type C: Stretches / holds (`trackingType: 'completion'`, `unilateral: 'split_weight'`)

Per-side done toggles:

```
Left: [✅]    Right: [✅]
```

No kg or reps inputs. Tapping toggles completion. Optionally show a countdown timer per side if `timerSeconds` is set.

**Exercises:** couch-stretch, pigeon-stretch, calf-stretch

### localStorage format for unilateral exercises

```javascript
// split_weight
sets: [
  { weightL: 5, repsL: 10, weightR: 5, repsR: 10 },
  ...
]

// split_reps
weight: 20,  // shared
sets: [
  { repsL: 8, repsR: 7 },
  ...
]
```

### Double progression for unilateral exercises

For `split_reps` with a rep range: check BOTH sides. ALL sets on BOTH sides must hit top of range before nudging weight up. If left hits 8/8/8 but right only hits 7/8/8, no bump yet. Show per-side status:

```
L: ✅ All at 8    R: ⚠️ 1 set below
→ Stay at this weight
```

---

## 3. Built-in Countdown Timer

Any exercise with `trackingType: 'duration'` or `trackingType: 'completion'` where `timerSeconds` is set gets a countdown timer in the exercise detail view.

### UI

```
┌─────────────────────────┐
│  Couch stretch           │
│  Target: 60s per side    │
│                          │
│  LEFT                    │
│  [ 1:00 ]  ▶ START       │
│                          │
│  RIGHT                   │
│  [ 1:00 ]  ▶ START       │
└──────────────────────────┘
```

### Behaviour
- Tap **▶ START** → counts down → haptic vibration (`navigator.vibrate(200)`) + audio beep on completion
- Timer shows mm:ss format
- Pause/resume on tap during countdown
- Auto-marks that side as ✅ when timer reaches 0
- For bilateral duration exercises (backward treadmill): single timer, single ✅
- For unilateral: sequential L then R timers

### Timer sound
Use Web Audio API to generate a short beep (no external audio file needed):
```javascript
const ctx = new AudioContext();
const osc = ctx.createOscillator();
osc.frequency.value = 880;
osc.connect(ctx.destination);
osc.start(); setTimeout(() => osc.stop(), 200);
```

---

## 4. Sled Tracking (`trackingType: 'sled'`)

Special tracking type for the sled exercise. Three inputs per set + one persistent field:

### Persistent field (top of exercise detail, above sets)
```
Length distance: [__] m     ← persists in localStorage key: gym-sled-length-distance
                              Pre-fills from last session. User updates when changing gyms.
```

### Per-set inputs
```
Set 1:  [kg on sled]  ×  [lengths]  ×  [time mm:ss]
```

- **kg on sled**: weight loaded. Pre-fills from last session.
- **lengths**: number of lengths (push one way = 1 length). Pre-fills from last session.
- **time**: duration of the set. Input as mm:ss. Optionally: a START/STOP timer button that auto-fills this field.
- **Derived (display only):** total distance = lengths × length_distance. Show below the set: "= 120m"

### Built-in stopwatch option
Next to the time input, show a ⏱️ button. Tap to start counting up. Tap again to stop. Auto-fills the time field with the elapsed time. This is easier than typing mm:ss with sweaty hands.

### localStorage
```javascript
// Persistent across sessions
'gym-sled-length-distance': '15'  // meters per length

// Per-set data
sets: [
  { weight: 30, lengths: 8, timeSeconds: 245 }
]
```

---

## 5. Variant System

### UI: pill selector at top of exercise detail

```
┌─────────────────────────────────┐
│  Tibialis raise                  │
│  [Wall (BW)]  [Tib Bar]  ← pills│
│  ────────────────────────────── │
│  (rest of exercise detail)       │
└─────────────────────────────────┘
```

- Selected pill is highlighted (filled background)
- Selection persists in localStorage: `gym-variant-{exerciseId}`
- When variant changes, the tracking inputs update immediately
- History shows which variant was used (stored in session data)

### Variant definitions

```javascript
// Tibialis raise
variants: [
  { id: 'wall', label: 'Wall (BW)', trackingType: 'reps_only', isDefault: true },
  { id: 'tib-bar', label: 'Tib Bar', trackingType: 'weight_reps', isDefault: false }
]

// Ham curl
variants: [
  { id: 'seated', label: 'Seated', trackingType: 'weight_reps', isDefault: true },
  { id: 'prone', label: 'Prone (lying)', trackingType: 'weight_reps', isDefault: false }
]

// Reverse squat (cable)
variants: [
  { id: 'cable', label: 'Cable + straps', trackingType: 'weight_reps', isDefault: true },
  { id: 'garhammer', label: 'Garhammer (bars)', trackingType: 'reps_only', isDefault: false }
]

// Back extension
variants: [
  { id: '45deg', label: '45° back ext', trackingType: 'weight_reps', isDefault: true },
  { id: 'reverse-hyper', label: 'Reverse hyper', trackingType: 'weight_reps', isDefault: false }
]
```

### Session data with variant
```javascript
{
  id: "tibialis-raise",
  variant: "wall",  // ← which variant was used this session
  sets: [{ reps: 20 }, { reps: 20 }],
  notes: ""
}
```

---

## 6. Pre-filled Reps

### Logic
If `prefillReps` is set (not null), auto-populate the reps input with that value. User can always tap and change. For unilateral exercises, pre-fill both L and R with the same value.

### Which exercises get pre-filled reps

**Pre-fill (fixed rep target):**
- Backward treadmill: N/A (duration)
- Sled: N/A (sled tracking)
- Tibialis raise: `prefillReps: null` (range 15-20)
- Seated/SL calf raise: `prefillReps: null` (range 15-20)
- Couch stretch: N/A (completion)
- Internal hip DB lift: `prefillReps: 20`
- Loaded butterfly: `prefillReps: 20`
- Pigeon stretch: N/A (completion)
- Pullover: `prefillReps: 10`
- Trap-3 raise: `prefillReps: 8`
- Back extension: `prefillReps: 12`
- Reverse squat: `prefillReps: 20`
- Glute bridge: `prefillReps: 15`
- QL extension: `prefillReps: 10`
- Nordic curl: `prefillReps: 5`
- Farmer's carry: N/A (distance)
- Patrick step-up: `prefillReps: 20`
- Big toe stretch: N/A (completion)
- Calf stretch: N/A (completion)
- Jefferson curl: `prefillReps: 20`
- Cable pancake: `prefillReps: 20`
- Reverse nordics: `prefillReps: 10`
- Ham curl (activation, 1 set): `prefillReps: 12`
- Lateral band walk: `prefillReps: 15`
- Rhythm squat: `prefillReps: 50`
- Petersen step-up: `prefillReps: 15`
- Poliquin step-up: `prefillReps: 20`
- Hack squat: `prefillReps: 15`
- Cossack squat: `prefillReps: 8`
- Cable chop: `prefillReps: 10`

**Leave blank (rep range — user enters actual):**
- Back squat: range 6-8
- Front squat: range 6-8
- ATG split squat: range 6-8
- ATG lunge: range 6-8
- Weighted pull-ups: range 6-8
- Weighted dips: range 6-8
- Pull-ups (BW): range 6-8
- Dips (BW): range 6-8
- RDL: range 8-10
- Ham curl (main sets): range 8-10
- Shoulder press: range 8-12
- Incline DB press: range 8-12
- Full range row: range 8-12
- Scott curl: range 8-12
- Hammer curls: range 8-12
- OH tricep ext: range 8-12
- Powell raise: range 8-12
- External rotation: range 10-12
- Band pull-apart: range 12 (fixed? — pre-fill 12)

---

## 7. Programme Corrections (update in HTML)

### 7a. Back extension — fix W6 reps

W6 back extension was `3×8/8`. Change to `3×12` (bilateral, same as W1 and W3).

### 7b. Sled naming unification

Replace BOTH of these:
- "Reverse sled / deadmilling" (W1, W2, W3)
- "Push-pull sled" (W4, W5, W6)

With ONE exercise across all 6 workouts:
- **ID:** `sled`
- **Name:** `"Sled (push + pull)"`
- **trackingType:** `'sled'`
- **sets:** 1
- **reps:** (remove old "8 lengths" — user enters lengths + time per set)
- **formCues:** `"Stay low on pull. Knees forward. VMO = bent-knee throughout. Push: drive through balls of feet."`

### 7c. ATG split squat naming

- **Name:** `"ATG split squat (no walking)"`
- **unilateral:** `'split_reps'`
- **reps:** `"6-8/side"`
- **repRange:** `[6, 8]`
- **progressionType:** `'compound'`
- **formCues:** add `"Stationary — no walking. Same DBs both hands. Full set one leg, then switch."`

### 7d. ATG lunge — rename + add double progression

- **Name:** `"ATG lunge (walking)"`
- **unilateral:** `'split_reps'`
- **reps:** `"6-8 steps/side"` (was "6m/6")
- **repRange:** `[6, 8]`
- **progressionType:** `'compound'` (was effectively null — **newly applying double progression**)
- **formCues:** add `"Walking. Same DBs both hands. 6-8 steps per leg = 12-16 alternating steps per set. All sets at 8/side → add weight."`

### 7e. Reverse squat — add Garhammer variant

- **Name:** `"Reverse squat (cable)"`
- Add `variants` array (see section 5 above)
- Default variant: `'cable'` (cable + straps, lying)
- Variant 2: `'garhammer'` (Garhammer raise on bars, bodyweight)

---

## 8. Complete Exercise Metadata Table

Reference for Claude Code — apply these properties to every exercise in the `programme` object.

| Exercise ID | trackingType | unilateral | prefillReps | timerSeconds | variants | repsLabel | weightLabel |
|---|---|---|---|---|---|---|---|
| backward-treadmill | duration | false | null | 120 | null | — | — |
| sled | sled | false | null | null | null | lengths | kg |
| tibialis-raise | (per variant) | false | null | null | wall/tib-bar | reps | kg |
| seated-calf-raise | weight_reps | false | null | null | null | reps | kg |
| sl-calf-raise | weight_reps | split_weight | null | null | null | reps | kg |
| couch-stretch | completion | split_weight | null | 60 | null | — | — |
| internal-hip-db-lift | weight_reps | split_weight | 20 | null | null | reps | kg |
| loaded-butterfly | weight_reps | false | 20 | null | null | reps | kg |
| pigeon-stretch | completion | split_weight | null | null | null | — | — |
| pullover | weight_reps | false | 10 | null | null | reps | kg |
| trap-3-raise | weight_reps | false | 8 | null | null | reps | kg |
| back-extension | weight_reps | false | 12 | null | 45deg/reverse-hyper | reps | kg |
| reverse-squat | weight_reps | false | 20 | null | cable/garhammer | reps | kg |
| glute-bridge | weight_reps | false | 15 | null | null | reps | kg |
| ql-extension | weight_reps | split_weight | 10 | null | null | reps | kg |
| nordic-curl | weight_reps | false | 5 | null | seated/prone (ham curl variants) | reps | kg |
| back-squat | weight_reps | false | null | null | null | reps | kg |
| front-squat | weight_reps | false | null | null | null | reps | kg |
| farmers-carry | weight_distance | false | null | null | null | meters | kg/hand |
| patrick-step-up | weight_reps | split_weight | 20 | null | null | reps | kg |
| big-toe-stretch | completion | false | null | 45 | null | — | — |
| calf-stretch | completion | split_weight | null | 45 | null | — | — |
| jefferson-curl | weight_reps | false | 20 | null | null | reps | kg |
| cable-pancake | weight_reps | false | 20 | null | null | reps | kg |
| atg-split-squat | weight_reps | split_reps | null | null | null | reps | kg |
| atg-lunge | weight_reps | split_reps | null | null | null | steps | kg |
| rdl | weight_reps | false | null | null | null | reps | kg |
| weighted-pull-ups | weight_reps | false | null | null | null | reps | kg |
| weighted-dips | weight_reps | false | null | null | null | reps | kg |
| pull-ups | weight_reps | false | null | null | null | reps | kg |
| dips | weight_reps | false | null | null | null | reps | kg |
| scott-curl | weight_reps | false | null | null | null | reps | kg |
| shoulder-press | weight_reps | false | null | null | null | reps | kg |
| powell-raise | weight_reps | false | null | null | null | reps | kg |
| external-rotation | weight_reps | false | null | null | null | reps | kg |
| oh-tricep-ext | weight_reps | false | null | null | null | reps | kg |
| reverse-nordics | weight_reps | false | 10 | null | null | reps | kg |
| ham-curl | weight_reps | false | null | null | seated/prone | reps | kg |
| incline-press | weight_reps | false | null | null | null | reps | kg |
| full-range-row | weight_reps | false | null | null | null | reps | kg |
| hack-squat | weight_reps | false | 15 | null | null | reps | kg |
| lateral-band-walk | completion | false | null | null | null | — | — |
| cossack-squat | weight_reps | split_weight | 8 | null | null | reps | kg |
| rhythm-squat | weight_reps | false | 50 | null | null | reps | kg |
| kot-sissy-squat | weight_reps | false | 10 | null | null | reps | kg |
| cable-chop | weight_reps | split_weight | 10 | null | null | reps | kg |
| band-pull-apart | weight_reps | false | 12 | null | null | reps | — |
| hammer-curls | weight_reps | false | null | null | null | reps | kg |
| petersen-step-up | weight_reps | split_weight | 15 | null | null | reps | kg |
| poliquin-step-up | weight_reps | split_weight | 20 | null | null | reps | kg |

---

## 9. Markdown Export Format Updates

Update the export format to handle new tracking types:

```markdown
## 8 April 2026 — Workout 1 (Back Health + Posterior Chain)

**Overall:** Good session. Energy high.
**Injuries:** None.

- **Backward treadmill** — 2:00 ✅
- **Sled (push + pull)** — 1×[8 lengths, 4:05] @ 30kg (length = 15m, total ~120m)
- **Tibialis raise** [Wall] — 2×[20, 20] @ BW
- **QL extension** — 3×[L10/R10, L10/R10, L10/R10] @ L:5kg R:5kg
  - Beautiful work. Bottom foot settled.
- **ATG split squat (no walking)** — 5×[L8/R7, L8/R8, L8/R7, L8/R8, L8/R8] @ 15kg
  - Left leg stronger. Right struggling at bottom.
- **Back squat** — 5×[6,7,7,8,8] @ 50kg
- **Farmer's carry** — 3×[40m, 35m, 30m] @ 22kg/hand
```

---

## 10. Summary of Breaking Changes

These changes affect the existing `programme` data structure and localStorage format:

1. **New fields on exercise objects** — all existing exercises need the new properties added
2. **Sled exercise ID changed** — old IDs `reverse-sled` and `push-pull-sled` → unified `sled`. History lookup needs to match old IDs to new.
3. **ATG lunge rep range changed** — was no progression, now compound 6-8. Existing history (if any) unaffected.
4. **Back extension W6 reps changed** — `8/8` → `12`
5. **localStorage set format** — unilateral exercises store `weightL/weightR/repsL/repsR` instead of `weight/reps`. Import parser needs updating.
6. **Variant field in session data** — new field, backward-compatible (null = default variant)

When regenerating the HTML, ensure all old exercise IDs still match for history lookup. Add an alias map if IDs change:
```javascript
const idAliases = {
  'reverse-sled': 'sled',
  'push-pull-sled': 'sled',
  'back-extension-w1': 'back-extension',
  'reverse-squat-w1': 'reverse-squat',
  'ql-extension-w1': 'ql-extension'
};
```
