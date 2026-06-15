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

Routine URL: https://claude.ai/code/routines/trig_018TzQnbF3B72SSXXCZZuht5
Routine ID: `trig_018TzQnbF3B72SSXXCZZuht5`
Environment ID: `env_01LUkY5Dc8PMo1KRSHpUiQL3`

## Google Drive Training File

- Name: `Nathaniel K - TL - 2026`
- Shared by: jenya@virtustrength.com (coach Jenya Shapira)
- File ID: `17zJk4UYoWDKD301ZkV-X_paIYw4I3Z6zeREkfuhnXR4`

## Owner

Nathaniel Kinzelberg — kinzelberg1@gmail.com
