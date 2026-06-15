import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Book from './Book'
import logsData from '../data/logs.json'
import { hashColor } from '../App'
import './Bookcase.css'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

// Bolts only along the top crown and sides (top/bottom of each panel — not middle)
const BOLTS = [
  { id: 'ct1', style: { top: '8px', left: '18%'  } },
  { id: 'ct2', style: { top: '8px', left: '38%'  } },
  { id: 'ct3', style: { top: '8px', right: '38%' } },
  { id: 'ct4', style: { top: '8px', right: '18%' } },
  { id: 'lt',  style: { top: '46px', left: '10px' } },
  { id: 'lb',  style: { bottom: '46px', left: '10px' } },
  { id: 'rt',  style: { top: '46px', right: '10px' } },
  { id: 'rb2', style: { bottom: '90px', right: '10px' } }, // SECRET
  { id: 'rb1', style: { bottom: '46px', right: '10px' } },
]
const SECRET = 'rb2'

function BoltSVG() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" fill="#5C3A14" stroke="#8B5A22" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="4" fill="#3A2008" stroke="#6B4012" strokeWidth="1" />
      <circle cx="12" cy="12" r="1.5" fill="#2A1408" />
      <line x1="12" y1="9" x2="12" y2="15" stroke="#4A2E10" strokeWidth="0.8" />
      <line x1="9" y1="12" x2="15" y2="12" stroke="#4A2E10" strokeWidth="0.8" />
    </svg>
  )
}

function KeySVG() {
  return (
    <svg viewBox="0 0 48 22" width="48" height="22" fill="none">
      <circle cx="9" cy="11" r="8" stroke="#C9A84C" strokeWidth="2.5" fill="none" />
      <circle cx="9" cy="11" r="3.5" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
      <line x1="17" y1="11" x2="46" y2="11" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="11" x2="36" y2="16" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="42" y1="11" x2="42" y2="15" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Bookcase({ onBookClick, unlocked, onUnlock }) {
  const years = Object.keys(logsData).sort()
  const [hasKey, setHasKey] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [shake, setShake] = useState(false)
  const [lockShake, setLockShake] = useState(false)
  const [notice, setNotice] = useState(null)
  const noticeTimer = useState(null)

  const showNotice = (msg) => {
    setNotice(msg)
    clearTimeout(noticeTimer[0])
    noticeTimer[0] = setTimeout(() => setNotice(null), 2800)
  }

  const [showLocked, setShowLocked] = useState(false)
  const lockedTimer = useState(null)

  const triggerLocked = () => {
    setLockShake(true)
    setShowLocked(true)
    clearTimeout(lockedTimer[0])
    lockedTimer[0] = setTimeout(() => setShowLocked(false), 2000)
  }

  const handleLockClick = () => {
    if (hasKey) {
      onUnlock()
    } else {
      setShowPassword(s => !s)
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setAttempted(true)
    setPassword('')
    setShake(true)
    setTimeout(() => setShake(false), 450)
  }

  return (
    <div className="bookcase">
      <div className="bookcase__wall" />
      <div className="bookcase__side bookcase__side--left" />
      <div className="bookcase__side bookcase__side--right" />
      <div className="bookcase__crown" />

      {/* Bolts — only the secret one is interactive */}
      {BOLTS.map(({ id, style }) => (
        <button
          key={id}
          className={`bc-bolt ${id === SECRET && !unlocked ? 'bc-bolt--secret' : ''}`}
          style={style}
          onClick={() => !unlocked && id === SECRET && setHasKey(true)}
          aria-label="bolt"
        >
          <BoltSVG />
        </button>
      ))}

      {/* "Locked" text — left of the lock */}
      <AnimatePresence>
        {showLocked && !unlocked && (
          <motion.div
            className="bc-locked-text"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.18 }}
          >
            Locked
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lock — sits on the crown at top center */}
      <AnimatePresence>
        {!unlocked && (
          <motion.div
            className={`bc-lock ${hasKey ? 'bc-lock--ready' : ''}`}
            initial={{ opacity: 0, y: -6 }}
            animate={lockShake
              ? { x: [-8, 8, -7, 7, -5, 5, -2, 2, 0], opacity: 1, y: 0 }
              : { x: 0, opacity: 1, y: 0 }
            }
            onAnimationComplete={() => setLockShake(false)}
            exit={{ opacity: 0, scale: 0.3, rotate: 20, transition: { duration: 0.4 } }}
            onClick={handleLockClick}
          >
            <AnimatePresence>
              {hasKey && (
                <motion.div
                  className="bc-key"
                  initial={{ x: -16, opacity: 0, rotate: -30 }}
                  animate={{ x: 0, opacity: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                >
                  <KeySVG />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="bc-lock__shackle" />
            <div className="bc-lock__body">
              <div className="bc-lock__keyhole" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password form — appears when lock is clicked without key */}
      <AnimatePresence>
        {showPassword && !hasKey && !unlocked && (
          <motion.form
            className="bc-password"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            onSubmit={handlePasswordSubmit}
          >
            <div className="bc-password__row">
              <input
                className="bc-password__input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="enter password"
                autoFocus
              />
              <button className="bc-password__submit" type="submit">→</button>
            </div>
            <AnimatePresence>
              {attempted && (
                <motion.div
                  className="bc-password__error"
                  initial={{ opacity: 0 }}
                  animate={shake
                    ? { opacity: 1, x: [-5, 5, -5, 5, -3, 3, 0] }
                    : { opacity: 1, x: 0 }
                  }
                  transition={{ duration: 0.4 }}
                >
                  Incorrect.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Empty book notice */}
      <AnimatePresence>
        {notice && (
          <motion.div
            className="bc-notice"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bookcase__interior">
        {years.map((year) => (
          <div key={year} className="shelf-unit">
            <div className="shelf-unit__label">{year}</div>
            <div className="shelf-unit__row">
              <div className="shelf-bracket shelf-bracket--left" />
              <div className="shelf-unit__books">
                {MONTHS.map((month) => {
                  const entries = logsData[year]?.[month] ?? []
                  return (
                    <Book
                      key={month}
                      month={month}
                      year={year}
                      color={hashColor(month + year)}
                      hasData={entries.length > 0}
                      entryCount={entries.length}
                      isSummary={false}
                      onClick={() => {
                        if (!unlocked) { triggerLocked(); return }
                        if (entries.length > 0) onBookClick(year, month)
                        else showNotice(`No content in ${month} ${year} yet`)
                      }}
                    />
                  )
                })}
                <Book
                  month="SUMMARY"
                  year={year}
                  color="#C9A84C"
                  hasData={false}
                  entryCount={0}
                  isSummary={true}
                  onClick={() => {
                    if (!unlocked) { triggerLocked(); return }
                    showNotice(`No content in ${year} Summary yet`)
                  }}
                />
              </div>
              <div className="shelf-bracket shelf-bracket--right" />
            </div>
            <div className="shelf-plank">
              <div className="shelf-plank__face" />
              <div className="shelf-plank__front" />
              <div className="shelf-plank__shadow" />
            </div>
          </div>
        ))}
        <div className="shelf-plank shelf-plank--bottom">
          <div className="shelf-plank__face" />
          <div className="shelf-plank__front" />
        </div>
      </div>
    </div>
  )
}
