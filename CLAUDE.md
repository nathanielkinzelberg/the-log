# TheLog

Personal daily journal viewer — powerlifting training logs rendered as a wooden bookcase.

## GitHub

https://github.com/nathanielkinzelberg/the-log (public)
Live: https://nathanielkinzelberg.github.io/the-log

## Structure

```
the-log/
  logs/                        # markdown journal entries (source of truth)
    YYYY/
      MonthName/
        YYYY-MM-DD.md
  src/                         # React frontend
    data/logs.json             # built from logs/ by scripts/build-logs.js
    components/
      Bookcase.jsx/css         # bookcase UI — bolts, lock, year rows, book grid
      Book.jsx/css             # individual book with fabric texture, page edges, tassel
      BookViewer.jsx/css       # journal page reader (opened after unlock)
  scripts/
    build-logs.js              # reads logs/, outputs src/data/logs.json
  .github/workflows/deploy.yml # auto-deploys to GitHub Pages on every push to main
```

## Log Format

`logs/YYYY/MonthName/YYYY-MM-DD.md`

Each file has two sections:
1. **Training** — markdown table: exercise, sets, reps, load, target RPE, actual RPE, notes
2. **Journal** — short narrative paragraph

Optional extra sections (e.g. **Coding**, **Life**) are preserved by the nightly routine.

## Building

```bash
npm run build:data   # regenerate src/data/logs.json from logs/
npm run dev          # start dev server at localhost:5173/the-log/
npm run build        # production build → dist/
```

Run `build:data` any time new log files are added before building or previewing.
GitHub Actions runs both automatically on every push.

## Bookcase UI

- 1 row per year, 13 books per row (12 months + 1 gold summary book)
- Books fill the shelf width using flex — no gaps unless a year has no entries
- Empty month books are dimmed but still animate on hover and show a notice when clicked
- Gold summary book at end of each row has a tassel; shows notice when clicked
- Notice text: *"No content in [Month] [Year] yet"* or *"No content in [Year] Summary yet"*
- Fades out after ~3 seconds

## Lock Mechanic

The bookcase is locked by default. The padlock sits on the crown (top center).

**Clicking the lock** → password input appears below it. Every password entered shows "Incorrect." — there is no correct password via this method.

**Real unlock sequence:**
1. Find the second-from-bottom bolt on the right side panel (`id: rb2`, `bottom: 90px, right: 10px`)
2. Click it → a gold key appears above the lock
3. Click the lock → unlocked for the session

**Bolt layout:** 4 bolts along the top crown, 2 on the left panel (top + bottom), 3 on the right panel (top + secret + bottom). Only `rb2` is interactive — all others are decorative.

Unlocked state persists for the browser session only.

## Nightly Routine (Cloud Agent)

Runs daily at midnight Israel time (cron `0 21 * * *` UTC).

- Reads yesterday's training from Google Drive: `Nathaniel K - TL - 2026`
  - File ID: `17zJk4UYoWDKD301ZkV-X_paIYw4I3Z6zeREkfuhnXR4`
  - MCP connector: `cdc50e4b-d634-440d-90d6-4e4ea13b4771`
- Writes `logs/YYYY/MonthName/YYYY-MM-DD.md` for yesterday
- Preserves any existing sections (Coding, Journal, etc.) — only updates Training + Journal
- Commits with message `log: YYYY-MM-DD daily entry`
- Pushes to GitHub via PAT

### Date calculation

The routine fires at midnight Israel time. **Always use the Israel timezone** when computing "yesterday" — the container runs UTC and `date -d yesterday` will return the wrong date after 21:00 UTC:

```bash
TZ=Asia/Jerusalem date -d yesterday +%Y-%m-%d   # e.g. 2026-06-15
TZ=Asia/Jerusalem date -d yesterday +%B          # e.g. June
TZ=Asia/Jerusalem date -d yesterday +%Y          # e.g. 2026
```

### Git author

Commits use the owner's account so they count toward GitHub contribution streaks:

```bash
git config user.email 'nathanielkinzelberg@gmail.com'
git config user.name 'Nathaniel Kinzelberg'
```

### Commit count — 3 to 15 per run

Every run must produce between 3 and 15 commits (pick a random target at the start; going slightly over is fine). Do **not** squash everything into one. Build up the day's entry incrementally, one commit per logical chunk, then pad with small extras until the target is hit.

**Natural commit sequence (use as many as apply):**

1. `log: YYYY-MM-DD — create entry` — empty file or just the `# YYYY-MM-DD` header
2. `log: YYYY-MM-DD — metadata` — bodyweight, readiness, fatigue line
3. `log: YYYY-MM-DD — <exercise name>` — one commit per exercise table (squat, bench, deadlift, accessories each get their own commit)
4. `log: YYYY-MM-DD — journal` — narrative paragraph
5. `data: rebuild logs.json` — run `npm run build:data` and commit `src/data/logs.json`

**Padding commits to reach the target** (use freely, in any order, each as its own commit):
- Append a short protein-appreciation sentence to the journal (`log: YYYY-MM-DD — protein note`)
- Fix a typo or tweak punctuation in today's entry (`log: YYYY-MM-DD — cleanup`)
- Add or adjust an emoji in the journal (`log: YYYY-MM-DD — vibe check`)
- Re-run `npm run build:data` and re-commit if the json changed (`data: refresh logs.json`)
- Append a one-liner "session reflection" sentence to the journal (`log: YYYY-MM-DD — reflection`)
- Add a blank line or minor formatting touch to the markdown (`log: YYYY-MM-DD — formatting`)

**Always commit something:** even if training data was missing or the file was already complete, pad to at least 3 commits using the protein/reflection/emoji padding above.

Routine URL: https://claude.ai/code/routines/trig_018TzQnbF3B72SSXXCZZuht5
Routine ID: `trig_018TzQnbF3B72SSXXCZZuht5`
Environment ID: `env_01LUkY5Dc8PMo1KRSHpUiQL3`

## Google Drive Training File

- Name: `Nathaniel K - TL - 2026`
- Shared by: jenya@virtustrength.com (coach Jenya Shapira)
- File ID: `17zJk4UYoWDKD301ZkV-X_paIYw4I3Z6zeREkfuhnXR4`

## Owner

Nathaniel Kinzelberg — kinzelberg1@gmail.com
