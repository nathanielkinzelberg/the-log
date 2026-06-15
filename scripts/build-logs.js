import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOGS_DIR = join(__dirname, '../logs')
const OUTPUT_DIR = join(__dirname, '../src/data')
const OUTPUT = join(OUTPUT_DIR, 'logs.json')

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

async function buildLogs() {
  const result = {}

  let years
  try {
    const entries = await readdir(LOGS_DIR)
    years = entries.filter(e => /^\d{4}$/.test(e)).sort()
  } catch {
    console.error('Could not read logs dir:', LOGS_DIR)
    process.exit(1)
  }

  for (const year of years) {
    result[year] = {}
    const yearDir = join(LOGS_DIR, year)

    for (const month of MONTHS) {
      result[year][month] = []
      const monthDir = join(yearDir, month)
      if (!existsSync(monthDir)) continue

      let files
      try {
        const all = await readdir(monthDir)
        files = all.filter(f => f.endsWith('.md') && !f.startsWith('.')).sort()
      } catch {
        continue
      }

      for (const file of files) {
        const date = file.replace('.md', '')
        const dayNum = parseInt(date.split('-')[2])
        const weekNum = Math.ceil(dayNum / 7)
        const content = await readFile(join(monthDir, file), 'utf-8')
        result[year][month].push({ date, weekNum, content })
      }
    }
  }

  if (!existsSync(OUTPUT_DIR)) await mkdir(OUTPUT_DIR, { recursive: true })
  await writeFile(OUTPUT, JSON.stringify(result, null, 2))
  console.log(`Built logs.json — ${years.length} years`)
}

buildLogs()
