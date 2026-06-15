import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Bookcase from './components/Bookcase'
import BookViewer from './components/BookViewer'
import logsData from './data/logs.json'
import './App.css'

const BOOK_COLORS = [
  '#7B2D2D','#2D4A7B','#2D6B3A','#6B2D6B',
  '#7B5A2D','#2D6B6B','#8B3A2D','#3A2D7B',
  '#5A7B2D','#7B2D4A','#2D4A4A','#6B4A2D',
]

export function hashColor(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i)
    h = h & h
  }
  return BOOK_COLORS[Math.abs(h) % BOOK_COLORS.length]
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false)
  const [openBook, setOpenBook] = useState(null)

  const handleBookClick = (year, month) => {
    if (unlocked) setOpenBook({ year, month })
  }

  return (
    <div className="app">
      <Bookcase
        onBookClick={handleBookClick}
        unlocked={unlocked}
        onUnlock={() => setUnlocked(true)}
      />

      <AnimatePresence>
        {openBook && (
          <BookViewer
            key={`${openBook.year}-${openBook.month}`}
            year={openBook.year}
            month={openBook.month}
            entries={logsData[openBook.year]?.[openBook.month] ?? []}
            color={hashColor(openBook.month + openBook.year)}
            onClose={() => setOpenBook(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
