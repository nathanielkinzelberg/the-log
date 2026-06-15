import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import './BookViewer.css'

const WEEK_LABELS = ['I', 'II', 'III', 'IV', 'V']

export default function BookViewer({ year, month, entries, color, onClose }) {
  const weeks = Array.from(new Set(entries.map(e => e.weekNum))).sort((a, b) => a - b)
  const [activeWeek, setActiveWeek] = useState(weeks[0] ?? 1)
  const [activeDate, setActiveDate] = useState(entries[0]?.date ?? null)
  const [direction, setDirection] = useState(1)

  const weekEntries = entries.filter(e => e.weekNum === activeWeek)
  const activeEntry = entries.find(e => e.date === activeDate)

  const selectDay = useCallback((date) => {
    const cur = entries.findIndex(e => e.date === activeDate)
    const next = entries.findIndex(e => e.date === date)
    setDirection(next >= cur ? 1 : -1)
    setActiveDate(date)
  }, [activeDate, entries])

  const selectWeek = useCallback((w) => {
    setActiveWeek(w)
    const first = entries.find(e => e.weekNum === w)
    if (first) { setDirection(1); setActiveDate(first.date) }
  }, [entries])

  const navigate = useCallback((delta) => {
    const idx = entries.findIndex(e => e.date === activeDate)
    const next = entries[idx + delta]
    if (next) {
      setDirection(delta)
      setActiveDate(next.date)
      setActiveWeek(next.weekNum)
    }
  }, [activeDate, entries])

  const curIdx = entries.findIndex(e => e.date === activeDate)

  return (
    <motion.div
      className="viewer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="viewer"
        style={{ '--book-color': color }}
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        {/* book cover strip */}
        <div className="viewer__cover">
          <div className="viewer__cover-label">
            <span>{month}</span>
            <span className="viewer__cover-year">{year}</span>
          </div>
        </div>

        {/* left page — chapters + day list */}
        <div className="viewer__left">
          <div className="viewer__section-title">CHAPTERS</div>
          <div className="viewer__weeks">
            {weeks.map(w => (
              <button
                key={w}
                className={`viewer__week ${activeWeek === w ? 'viewer__week--active' : ''}`}
                onClick={() => selectWeek(w)}
              >
                <span className="viewer__week-num">{WEEK_LABELS[w - 1] ?? w}</span>
                <span className="viewer__week-label">WEEK {w}</span>
                <span className="viewer__week-count">{entries.filter(e => e.weekNum === w).length}d</span>
              </button>
            ))}
          </div>

          <div className="viewer__divider" />

          <div className="viewer__section-title">DAYS</div>
          <div className="viewer__days">
            {weekEntries.map(entry => (
              <button
                key={entry.date}
                className={`viewer__day ${activeDate === entry.date ? 'viewer__day--active' : ''}`}
                onClick={() => selectDay(entry.date)}
              >
                {entry.date}
              </button>
            ))}
          </div>

          {/* page navigation */}
          <div className="viewer__nav">
            <button
              className="viewer__nav-btn"
              onClick={() => navigate(-1)}
              disabled={curIdx <= 0}
            >
              ← PREV
            </button>
            <span className="viewer__nav-pos">{curIdx + 1} / {entries.length}</span>
            <button
              className="viewer__nav-btn"
              onClick={() => navigate(1)}
              disabled={curIdx >= entries.length - 1}
            >
              NEXT →
            </button>
          </div>
        </div>

        {/* spine */}
        <div className="viewer__spine" />

        {/* right page — content */}
        <div className="viewer__right">
          <AnimatePresence mode="wait" custom={direction}>
            {activeEntry ? (
              <motion.div
                key={activeEntry.date}
                className="viewer__page"
                custom={direction}
                initial={{ x: direction * 60, opacity: 0, rotateY: direction * 15 }}
                animate={{ x: 0, opacity: 1, rotateY: 0 }}
                exit={{ x: direction * -60, opacity: 0, rotateY: direction * -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{ transformPerspective: 1200 }}
              >
                <div className="viewer__page-date">{activeEntry.date}</div>
                <div className="viewer__page-content">
                  <ReactMarkdown>{activeEntry.content}</ReactMarkdown>
                </div>
              </motion.div>
            ) : (
              <div className="viewer__empty">No entry selected</div>
            )}
          </AnimatePresence>
        </div>

        {/* close */}
        <button className="viewer__close" onClick={onClose}>✕</button>
      </motion.div>
    </motion.div>
  )
}
