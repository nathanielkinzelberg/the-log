import { useState } from 'react'
import { motion } from 'framer-motion'
import './Book.css'

const MONTH_SHORT = {
  January:'JAN', February:'FEB', March:'MAR', April:'APR',
  May:'MAY', June:'JUN', July:'JUL', August:'AUG',
  September:'SEP', October:'OCT', November:'NOV', December:'DEC',
}

// deterministic height variation per month so it looks natural
function bookHeight(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i)
  return 155 + (Math.abs(h) % 45) // 155–200px
}

function colorLight(hex, amount = 30) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, (n >> 16) + amount)
  const g = Math.min(255, ((n >> 8) & 0xff) + amount)
  const b = Math.min(255, (n & 0xff) + amount)
  return `rgb(${r},${g},${b})`
}
function colorDark(hex, amount = 30) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, (n >> 16) - amount)
  const g = Math.max(0, ((n >> 8) & 0xff) - amount)
  const b = Math.max(0, (n & 0xff) - amount)
  return `rgb(${r},${g},${b})`
}

function Tassel() {
  return (
    <div className="tassel" aria-hidden="true">
      <div className="tassel__cord" />
      <div className="tassel__cap" />
      <div className="tassel__skirt">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="tassel__thread"
            style={{ height: `${22 + (i % 4) * 4}px` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Book({ month, year, color, hasData, entryCount, isSummary, onClick }) {
  const [hovered, setHovered] = useState(false)
  const label = isSummary ? 'YEAR\nSUM' : (MONTH_SHORT[month] ?? month.slice(0,3).toUpperCase())
  const height = isSummary ? 190 : bookHeight(month + year)
  const isEmpty = !hasData && !isSummary

  return (
    <div className={`book-wrap ${isSummary ? 'book-wrap--summary' : ''}`} style={{ height: height + 'px' }}>
      <motion.div
        className={`book ${isEmpty ? 'book--empty' : ''} ${isSummary ? 'book--summary' : ''} ${hovered ? 'book--hovered' : ''}`}
        style={{
          '--color': color,
          '--color-light': colorLight(color),
          '--color-dark': colorDark(color),
          '--height': height + 'px',
          height: height + 'px',
        }}
        onClick={onClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{ y: hovered ? -(height * 0.18) : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        {isSummary && <Tassel />}
        {/* main spine */}
        <div className="book__spine">
          {/* spine top band */}
          <div className="book__band book__band--top" />

          {/* title area */}
          <div className="book__title-area">
            <span className="book__label">{label}</span>
          </div>

          {/* center ornament */}
          <div className="book__ornament">
            {isSummary ? '✦' : '─'}
          </div>

          {/* year or count */}
          <div className="book__subtitle">
            {isSummary ? year : (hasData ? `${entryCount}` : '')}
          </div>

          {/* bottom band */}
          <div className="book__band book__band--bottom" />
        </div>

        {/* page block (right side — cream page edges) */}
        <div className="book__pages">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="book__page-line" />
          ))}
        </div>

        {/* top of book (visible when hovering) */}
        <div className="book__top" />
      </motion.div>
    </div>
  )
}
