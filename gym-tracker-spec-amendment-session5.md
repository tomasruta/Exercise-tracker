# Gym Tracker Spec Amendment — Session 5

**Date:** 7 April 2026
**Context:** Form cue audit completed. 10 new exercises now have detailed form cues in `strength-routine-2026-04-05.md`. Videos verified by Cowork. This amendment adds form cue display, exercise variants, and chop alternation tracking.

**Applies on top of:** `gym-tracker-spec.md` + `gym-tracker-spec-amendment.md` (Session 4)

---

## 1. FORM CUE DISPLAY

Each exercise in the tracker should have a collapsible "Form Cues" section. Tapping the exercise name or an ℹ️ icon expands it.

**Content per exercise** (pulled from `strength-routine-2026-04-05.md` NEW EXERCISE FORM CUES section):
- **Setup** — 1-3 bullet cues
- **Execution** — 3-5 bullet cues (the key form points)
- **Mistakes** — common errors with ❌ prefix
- **Your mod** — personal modifications (cervical, LPR, DNS-specific)

**Only the 10 new exercises get form cues.** ATG exercises (backward treadmill, tibialis, split squat, etc.) do not — user already knows form.

**The 10 exercises with form cues:**
1. RDL (W2, W5)
2. Scott curl — Zottman (W2)
3. Incline hammer curl (W4, W5)
4. Overhead tricep extension (W3, W6)
5. Glute bridge / hip thrust (W1)
6. Cossack squat (W3)
7. Lateral band walk (W3)
8. Half-kneel cable chop (W6)
9. Farmer's carry (W1)
10. Band pull-apart (W6)

**Implementation:** Form cue text can be hardcoded in the tracker for now. Future: read from the strength routine file.

---

## 2. EXERCISE VARIANTS

### 2a. Scott Curl — Preacher vs Spider Curl

Scott curl (W2 #13) has two variants depending on gym equipment availability:

| Variant | When | Setup |
|---|---|---|
| **Preacher bench** (default) | Gym has preacher bench | Arms over angled pad, armpits snug |
| **Spider curl** (fallback) | No preacher bench | Chest OVER incline bench, arms hanging on other side |

**UI:** Toggle at the top of the Scott curl exercise card. Selection persists in localStorage per gym (same pattern as sled `length_distance`). Both variants use the same Zottman rotation (supinate up, pronate down, 3s ecc). Weight/reps/sets are identical.

**Form cue text changes per variant:**
- Preacher: "Armpits snug against top of preacher pad"
- Spider curl: "Chest over incline bench, arms hanging straight down on the far side"

### 2b. Existing variants (from Session 4 — unchanged)

These were already specified in Session 4 amendment:
- Tibialis raise: Wall (BW) / Tib Bar (loaded)
- Ham curl: Seated / Prone
- Reverse squat: Cable + straps / Garhammer raise
- Back extension: 45° back ext / Reverse hyper

---

## 3. CABLE CHOP ALTERNATION TRACKING

Half-kneel cable chop (W6 #14) alternates between two directions each W6 session:
- **Hi→lo:** Cable at top, pull diagonally DOWN across body
- **Lo→hi:** Cable at bottom, pull diagonally UP across body

**Behaviour:**
1. First time user does W6 → default to hi→lo. Show label: "Session A: Hi→Lo"
2. When W6 is completed (all exercises logged) → store that this session was hi→lo
3. Next W6 session → auto-select lo→hi. Show label: "Session B: Lo→Hi"
4. Continue alternating. User can manually override if needed (tap to toggle).

**Storage:** `chop_direction` key in localStorage. Values: `"hi_lo"` or `"lo_hi"`. Flips on W6 completion.

**Display in exercise card:** Show current direction prominently: "🔄 Hi→Lo" or "🔄 Lo→Hi" next to the exercise name. Not buried in notes.

---

## 4. EXERCISE NAME CORRECTIONS (from Session 5)

These names changed since the original spec. Ensure the tracker uses the CORRECT names:

| Old name (may be in original spec) | Correct name | Workouts |
|---|---|---|
| Hammer curls | **Incline hammer curls** | W4 #16, W5 #13 |
| Scott curl (incline bench) | **Scott curl (Zottman) — Preacher bench** | W2 #13 |

---

## 5. FORM CUE DATA (for hardcoding)

Below are the condensed form cues for each exercise. These are the gym-floor-usable versions (shorter than the full form cue cards in the strength routine).

### RDL (W2, W5)
- **Setup:** Feet hip-width, soft knee bend stays constant, DBs at sides, scapulas packed
- **Do:** Hinge at hips, push butt back, DBs close to legs, stop at hamstring stretch or lumbar rounding
- **Don't:** Round lower back · Bend knees more on descent · Look up · Hyperextend at top
- **You:** Chin tucked throughout. Film from side for Kuma.

### Scott Curl — Zottman (W2)
- **Setup [Preacher]:** Armpits snug on preacher pad, arms fully extended at bottom
- **Setup [Spider curl]:** Chest over incline bench, arms hanging on far side
- **Do:** Curl up supinated → rotate pronated at top → 3s eccentric down pronated → rotate back at bottom
- **Don't:** Use incline bench behind back (wrong exercise!) · Rush eccentric · Swing shoulders
- **Start:** 5-7kg

### Incline Hammer Curl (W4, W5)
- **Setup:** Incline bench ~60°, sit back, arms hang BEHIND torso, neutral grip throughout
- **Do:** Curl up neutral grip, squeeze at top, 3s eccentric, full extension at bottom
- **Don't:** Bench too upright · Swing elbows forward · Supinate grip
- **Start:** 7-9kg

### Overhead Tricep Extension (W3, W6)
- **Setup:** Cable LOW, rope attachment, face AWAY from stack, staggered stance
- **Do:** Extend overhead to lockout, 3s eccentric back behind head, elbows forward
- **Don't:** Cable set high (that's pushdowns) · Elbows flare · Arch lower back
- **Start:** ~10kg

### Glute Bridge / Hip Thrust (W1)
- **Setup:** Mid-scapula on bench edge, feet flat hip-width, shins vertical at top
- **Do:** Drive hips up, 2s SQUEEZE at top (mandatory), ribs down, lower with control
- **Don't:** Hyperextend at top · Feet too far/close · Push through toes · Skip squeeze
- **Start:** BW → barbell

### Cossack Squat (W3)
- **Setup:** Wide stance ~1.5× shoulder width, toes out ~15-30°
- **Do:** Shift laterally, deep squat one side, straight leg heel stays down, alternate
- **Don't:** Heel lift on working leg · Knee collapse inward · Round back · Force depth
- **Start:** BW → goblet hold

### Lateral Band Walk (W3)
- **Setup:** Mini-band at ANKLES, quarter squat, hips back
- **Do:** Step laterally, trailing foot NEVER meets lead foot, stay low throughout
- **Don't:** Stand upright · Feet together · Toes out · Band too heavy
- **Start:** Light band

### Half-Kneel Cable Chop (W6)
- **Setup:** INSIDE knee down (closest to cable), outside foot forward
- **Do:** Pull diagonally across body, arms straight, trunk stays SQUARE
- **Don't:** Rotate trunk · Outside knee down · Pull with arms · Too heavy
- **Direction:** Alternates hi→lo / lo→hi each W6 session (see §3)
- **Start:** ~10-15kg

### Farmer's Carry (W1)
- **Setup:** Heavy DBs at sides, shoulders packed DOWN, tall spine, chin tucked
- **Do:** Walk 40m, normal gait, breathe
- **Don't:** Shrug shoulders · Sway · Look down · Choppy steps
- **Start:** 20-25kg/hand

### Band Pull-Apart (W6)
- **Setup:** Band at shoulder height, slight elbow bend, shoulders down
- **Do:** Pull apart by squeezing scapulae, elbows out+back, 1s squeeze at retraction
- **Don't:** Shrug · Pull with arms · Band too heavy · Stop short of full retraction
- **Start:** Medium band


---

## 6. PULL-UP GRIP ASSIGNMENTS — Three Separate Exercises

Pull-ups were "over/under/neutral" in one exercise. Now split into **three distinct exercises**, one grip per workout. Each is its own entry in the tracker with independent weight/rep history.

| Workout | Exercise name | Grip | Tracker ID |
|---|---|---|---|
| **W2 #11** | Weighted pull-up (overhand) | Pronated | `pullup_overhand` |
| **W4 #14** | Weighted chin-up (underhand) | Supinated | `chinup_underhand` |
| **W6 #12** | Weighted neutral pull-up | Neutral/hammer | `pullup_neutral` |

**Tracking:** Each has `added_weight` field (default 0kg = bodyweight). Double progression applies: BW until 3×8 clean → add 2.5kg → drop to 3×6.

**Dips** (W2 #12, W6 #13) remain a single exercise tracked as `weighted_dips` with same `added_weight` field.

---

## 7. MOBILITY EXERCISES — Track Weight

These mobility/stretch exercises should track weight (kg) even though they're not strength exercises. User wants to see load progression over time:

| Exercise | Workouts | What to track |
|---|---|---|
| Loaded butterfly | W1, W4 | Weight on lap (kg) |
| Internal hip dumbbell lift | W1, W4 | DB weight per side (kg) |

Both are `split_weight` type (per Session 4 spec — L/R get own kg).

---

## 8. ADDITIONAL VARIANTS

### Nordic curl (W1 #15)
| Variant | When | Equipment |
|---|---|---|
| **Nordic curl** (default) | Gym has anchor/pad | Floor anchor or partner |
| **Ham curl (seated)** (fallback) | No anchor available | Seated ham curl machine |

Same `variant` pattern as tibialis, back extension, etc. Persists per gym in localStorage.

### Ham curl — confirm Seated / Prone variant (Session 4)
Already specified in Session 4 amendment. Just confirming: ham curl variant toggle (seated vs prone) applies to ALL ham curl instances:
- W1 #15 fallback (if nordic not available)
- W4 #6 (activation set)
- W4 #13 (main working sets)
