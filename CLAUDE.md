# TheLog

Personal daily journal viewer — powerlifting training logs rendered as a wooden bookcase.

## GitHub

https://github.com/nathanielkinzelberg/the-log (public)

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
      Bookcase.jsx             # bookcase UI — 1 row per year, 13 books per row
      Book.jsx                 # individual book with fabric texture + tassel
      LockModal.jsx            # lock puzzle modal (secret: bottom-right bolt br2)
      BookViewer.jsx           # journal page reader
  scripts/
    build-logs.js              # reads logs/, outputs src/data/logs.json
```

## Log Format

`logs/YYYY/MonthName/YYYY-MM-DD.md`

Each file has two sections:
1. **Training** — markdown table: exercise, sets, reps, load, target RPE, actual RPE, notes
2. **Journal** — short narrative paragraph

## Building

```bash
npm run build:data   # regenerate src/data/logs.json from logs/
npm run dev          # start dev server at localhost:5173
npm run build        # production build → dist/
```

Run `build:data` any time new log files are added before building or previewing.

## Lock Mechanic

The bookcase is locked by default. Clicking any book opens a modal with:
- 12 hex bolts around a wooden frame
- 3 fake combination dials (decoy — do nothing)
- **Secret:** click the bottom-right bolt (`id: br2`, positioned at 94%, 94%)

Unlocked state persists for the browser session only.

## Nightly Routine (Cloud Agent)

A scheduled Claude agent runs daily at 11:59pm Asia/Jerusalem (cron `59 20 * * *` UTC):
- Reads today's training from Google Drive: `Nathaniel K - TL - 2026`
  - File ID: `17zJk4UYoWDKD301ZkV-X_paIYw4I3Z6zeREkfuhnXR4`
  - MCP connector: `cdc50e4b-d634-440d-90d6-4e4ea13b4771`
- Writes a new log file under `logs/`
- Commits with message `log: YYYY-MM-DD daily entry`
- Pushes to `https://github.com/nathanielkinzelberg/the-log`

Routine URL: https://claude.ai/code/routines/trig_018TzQnbF3B72SSXXCZZuht5
Routine ID: `trig_018TzQnbF3B72SSXXCZZuht5`
Environment ID: `env_01LUkY5Dc8PMo1KRSHpUiQL3`

## Google Drive Training File

- Name: `Nathaniel K - TL - 2026`
- Shared by: jenya@virtustrength.com (coach Jenya Shapira)
- File ID: `17zJk4UYoWDKD301ZkV-X_paIYw4I3Z6zeREkfuhnXR4`

## Owner

Nathaniel Kinzelberg — kinzelberg1@gmail.com
