import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './LockModal.css'

const BOLTS = [
  { id: 'tl1', x: '6%',  y: '6%'  },
  { id: 'tl2', x: '14%', y: '6%'  },
  { id: 'tc',  x: '50%', y: '4%'  },
  { id: 'tr1', x: '86%', y: '6%'  },
  { id: 'tr2', x: '94%', y: '6%'  },
  { id: 'ml',  x: '3%',  y: '50%' },
  { id: 'mr',  x: '97%', y: '50%' },
  { id: 'bl1', x: '6%',  y: '94%' },
  { id: 'bl2', x: '14%', y: '94%' },
  { id: 'bc',  x: '50%', y: '96%' },
  { id: 'br1', x: '86%', y: '94%' },
  { id: 'br2', x: '94%', y: '94%' }, // SECRET
]
const SECRET = 'br2'

function Bolt({ id, x, y, onUnlock }) {
  const [cracking, setCracking] = useState(false)
  const secret = id === SECRET

  const handleClick = useCallback(() => {
    if (!secret) return
    setCracking(true)
    setTimeout(onUnlock, 700)
  }, [secret, onUnlock])

  return (
    <motion.button
      className={`lock-bolt ${cracking ? 'lock-bolt--crack' : ''}`}
      style={{ left: x, top: y }}
      onClick={handleClick}
      whileHover={{ scale: 1.2 }}
      animate={cracking ? {
        rotate: [0, 15, -15, 30, 0],
        scale: [1, 1.3, 0.9, 1.5, 0],
        opacity: [1, 1, 1, 0.6, 0],
      } : {}}
      transition={{ duration: 0.65 }}
      aria-label="bolt"
    >
      <svg viewBox="0 0 24 24" fill="none">
        {/* hex bolt shape */}
        <polygon
          points="12,2 20,7 20,17 12,22 4,17 4,7"
          fill="#6B4A1A"
          stroke="#A07030"
          strokeWidth="1"
        />
        <circle cx="12" cy="12" r="4.5" fill="#4A3010" stroke="#8B6020" strokeWidth="1" />
        <circle cx="12" cy="12" r="2" fill="#3A2010" />
        {/* cross slot */}
        <line x1="12" y1="10" x2="12" y2="14" stroke="#6B4A1A" strokeWidth="1" />
        <line x1="10" y1="12" x2="14" y2="12" stroke="#6B4A1A" strokeWidth="1" />
      </svg>
    </motion.button>
  )
}

function DialWheel({ value, onChange }) {
  return (
    <motion.div className="dial" onClick={() => onChange((value + 1) % 10)} whileTap={{ scale: 0.93 }}>
      <div className="dial__track">
        <div className="dial__prev">{(value + 9) % 10}</div>
        <motion.div
          className="dial__cur"
          key={value}
          initial={{ y: -22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {value}
        </motion.div>
        <div className="dial__next">{(value + 1) % 10}</div>
      </div>
    </motion.div>
  )
}

export default function LockModal({ onUnlock, onClose }) {
  const [dials, setDials] = useState([0, 0, 0])
  const setDial = (i, v) => setDials(d => d.map((x, j) => j === i ? v : x))

  return (
    <motion.div
      className="lock-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="lock-modal"
        initial={{ scale: 0.88, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* wood frame of the modal with bolts */}
        <div className="lock-frame">
          {BOLTS.map(b => <Bolt key={b.id} {...b} onUnlock={onUnlock} />)}

          {/* inner content */}
          <div className="lock-inner">
            <div className="lock-heading">
              <div className="lock-heading__line" />
              <span>LOCKED</span>
              <div className="lock-heading__line" />
            </div>

            {/* padlock icon */}
            <div className="lock-icon">
              <div className="lock-icon__shackle" />
              <div className="lock-icon__body">
                <div className="lock-icon__keyhole" />
              </div>
            </div>

            {/* fake combination lock */}
            <div className="lock-combo">
              <div className="lock-combo__label">COMBINATION</div>
              <div className="lock-combo__dials">
                {dials.map((v, i) => (
                  <DialWheel key={i} value={v} onChange={val => setDial(i, val)} />
                ))}
              </div>
            </div>

            <div className="lock-hint">Turn the combination to unlock</div>
          </div>
        </div>

        {/* close X */}
        <button className="lock-close" onClick={onClose}>✕</button>
      </motion.div>
    </motion.div>
  )
}
