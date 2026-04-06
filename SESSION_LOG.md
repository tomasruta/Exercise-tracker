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
