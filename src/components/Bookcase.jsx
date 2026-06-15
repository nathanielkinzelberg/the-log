import { motion } from 'framer-motion'
import Book from './Book'
import logsData from '../data/logs.json'
import { hashColor } from '../App'
import './Bookcase.css'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export default function Bookcase({ onBookClick }) {
  const years = Object.keys(logsData).sort()

  return (
    <div className="bookcase">
      {/* back wall wood panels */}
      <div className="bookcase__wall" />

      {/* side panels */}
      <div className="bookcase__side bookcase__side--left" />
      <div className="bookcase__side bookcase__side--right" />

      {/* top crown */}
      <div className="bookcase__crown" />

      <div className="bookcase__interior">
        {years.map((year) => (
          <div key={year} className="shelf-unit">
            {/* year label on the side */}
            <div className="shelf-unit__label">{year}</div>

            <div className="shelf-unit__row">
              {/* left wall bracket */}
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
                      onClick={() => entries.length > 0 && onBookClick(year, month)}
                    />
                  )
                })}

                {/* gold summary book */}
                <Book
                  month="SUMMARY"
                  year={year}
                  color="#C9A84C"
                  hasData={false}
                  entryCount={0}
                  isSummary={true}
                  onClick={() => {}}
                />
              </div>

              {/* right wall bracket */}
              <div className="shelf-bracket shelf-bracket--right" />
            </div>

            {/* shelf plank */}
            <div className="shelf-plank">
              <div className="shelf-plank__face" />
              <div className="shelf-plank__front" />
              <div className="shelf-plank__shadow" />
            </div>
          </div>
        ))}

        {/* bottom shelf */}
        <div className="shelf-plank shelf-plank--bottom">
          <div className="shelf-plank__face" />
          <div className="shelf-plank__front" />
        </div>
      </div>
    </div>
  )
}
