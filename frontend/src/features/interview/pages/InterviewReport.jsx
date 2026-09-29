import React, { useState, useEffect } from 'react'
import '../styles/InterviewReport.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
  { id: 'technical', label: 'Technical Questions' },
  { id: 'behavioural', label: 'Behavioural Questions' },
  { id: 'roadmap', label: 'Road Map' },
]

// ── Sub-components ──────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="q-card">
      <div className="q-card__header" onClick={() => setOpen(o => !o)}>
        <span className="q-card__index">Q{index + 1}</span>
        <p className="q-card__question">{item.question}</p>
        <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>▾</span>
      </div>
      {open && (
        <div className="q-card__body">
          {item.intention && (
            <div className="q-card__section">
              <span className="q-card__tag">Intention</span>
              <p>{item.intention}</p>
            </div>
          )}
          <div className="q-card__section">
            <span className="q-card__tag">Model Answer</span>
            <p>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const RoadMapDay = ({ day }) => (
  <div className="roadmap-day">
    <div className="roadmap-day__header">
      <span className="roadmap-day__badge">Day {day.day}</span>
      <h3>{day.focus}</h3>
    </div>
    <ul className="roadmap-day__tasks">
      {(day.task || []).map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  </div>
)

// ── Main Component ──────────────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState('technical')
  const { report, loading, getReportById } = useInterview()
  const { interviewId } = useParams()

  useEffect(() => {
    if (interviewId) {
      getReportById({ interviewId })
    }
  }, [interviewId])

   
  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    )
  }

  if (!report) {
    return (
      <main className="loading-screen">
        <h1>Report not found.</h1>
      </main>
    )
  }

  const {
    matchScore = 0,
    skillGaps = [],
    technicalQuestions = [],
    behaviouralQuestions = [],
    preparationPlan = [],
  } = report

  const scoreColor =
    matchScore >= 80 ? 'score--high' : matchScore >= 60 ? 'score--mid' : 'score--low'

  return (
    <div className="interview-page">
      <div className="interview-layout">

        {/* Left Nav */}
        <nav className="interview-nav">
          <p className="interview-nav__label">Sections</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Center Content */}
        <main className="interview-content">
          {activeNav === 'technical' && (
            <section>
              <div className="content-header">
                <h2>Technical Questions</h2>
                <span>{technicalQuestions.length} questions</span>
              </div>
              {technicalQuestions.length === 0 && <p>No technical questions yet.</p>}
              <div className="q-list">
                {technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'behavioural' && (
            <section>
              <div className="content-header">
                <h2>Behavioural Questions</h2>
                <span>{behaviouralQuestions.length} questions</span>
              </div>
              {behaviouralQuestions.length === 0 && <p>No behavioural questions yet.</p>}
              <div className="q-list">
                {behaviouralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'roadmap' && (
            <section>
              <div className="content-header">
                <h2>Preparation Road Map</h2>
                <span>{preparationPlan.length}-day plan</span>
              </div>
              {preparationPlan.length === 0 && <p>No preparation plan yet.</p>}
              <div className="roadmap-list">
                {preparationPlan
                  .slice()
                  .sort((a, b) => a.day - b.day)
                  .map(day => (
                    <RoadMapDay key={day.day} day={day} />
                  ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="interview-sidebar">
          <div className="match-score">
            <p className="match-score__label">Match Score</p>
            <div className={`match-score__ring ${scoreColor}`}>
              <span className="match-score__value">{matchScore}</span>
              <span className="match-score__pct">%</span>
            </div>
          </div>

          <div className="skill-gaps">
            <p className="skill-gaps__label">Skill Gaps</p>
            {skillGaps.length === 0 && <p className="skill-gaps__empty">None found.</p>}
            <div className="skill-gaps__list">
              {skillGaps.map((gap, i) => (
                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

export default Interview