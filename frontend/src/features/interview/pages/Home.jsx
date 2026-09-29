import React,{useState,useRef,useEffect} from 'react'
import '../styles/Home.scss'
import { useInterview } from '../hooks/useInterview'
import {useNavigate} from 'react-router'
import { useAuthUser } from '../../auth/hooks/authUser'

function Home() {
const {loading,generateReport,getReports,reports}=useInterview()
const {handleLogout}=useAuthUser()

useEffect(() => {
  getReports()
}, [])

const [jobDescription, setJobDescription] = useState("")
const [selfDescription, setSelfDescription] = useState("")
const [error, setError] = useState()
const resumeInputRef = useRef()
const navigate = useNavigate()

const handleLogOut = async () => {
  await handleLogout()
  navigate('/login', { replace: true })
}

const handleGenrateReport = async ()=>{
  setError("") 
 const resumeFile = resumeInputRef.current.files[0]
 
 if(!jobDescription){
  setError("jobDescription is needed")
  return
 }
 if(!resumeFile && !selfDescription){
  setError("Please upload a resume or write a self description")
  return
 }
 try {
    const data = await generateReport({ resumeFile, jobDescription, selfDescription })
    if (data) navigate(`/interview/${data._id}`)
    else setError("Could not generate the report. Please try again.")
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong")
  }
}
if(loading){
  return (
    <main><h1>Loading your interview plan....</h1></main>
  )
 }
  return (
    <main className="home">
      <button type="button" className="home__logout" onClick={handleLogOut}>
        Log out
      </button>
      <header className="home__header">
        <h1 className="home__title">Draft a cover letter that fits the role</h1>
        <p className="home__subtitle">
          Paste the posting, drop in your résumé, add a little context — get a
          letter written for this job, not a template.
        </p>
        
      </header>

      <div className="home__desk">
        <p className='show_error'>{error}</p>
        <section className="panel panel--listing">
          <label htmlFor="jobDescription" className="panel__label">
            Job description
          </label>
          <textarea
          onChange={(e)=>setJobDescription(e.target.value)}
            name="jobDescription"
            id="jobDescription"
            className="panel__field panel__field--listing"
            placeholder="Paste the job posting here — responsibilities, requirements, anything that matters."
          />
        </section>

        <section className="home__stack">
          <div className="panel panel--upload">
            <label htmlFor="resume" className="panel__label">
              Your résumé
            </label>
            <div className="upload-slot">
              <input
              ref={resumeInputRef}
                type="file"
                name="resumeFile"
                id="resume"
                accept=".pdf"
                className="upload-slot__input"
              />
              <p className="upload-slot__hint">
                <span className="upload-slot__hint-main">Drop a PDF or click to browse</span>
                <span className="upload-slot__hint-sub">PDF only</span>
              </p>
            </div>
          </div>

          <div className="panel panel--about">
            <label htmlFor="selfDescription" className="panel__label">
              A bit about you
            </label>
            <textarea
            onChange={(e)=>setSelfDescription(e.target.value)}
              name="selfDescription"
              id="selfDescription"
              className="panel__field panel__field--about"
              placeholder="Strengths, tone, anything the letter should carry that your résumé won't say on its own."
            />
          </div>
        </section>
      </div>
<button onClick={handleGenrateReport} type="button" className="generate-btn">
          <span className="generate-btn__ring" aria-hidden="true" />
          <span className="generate-btn__label">Generate</span>
        </button> 
       {reports?.length > 0 && (
  <section className="recent-reports">
    <div className="recent-reports__header">
      <h2>Your previous reports</h2>
      <span>{reports.length}</span>
    </div>

    <div className="recent-reports__grid">
      {reports.map(report => (
        <button
          key={report._id}
          type="button"
          className="report-card"
          onClick={() => navigate(`/interview/${report._id}`)}
        >
          <div className="report-card__top">
            <h3 className="report-card__title">{report.title || 'Untitled report'}</h3>
            <span
              className={`report-card__score ${
                report.matchScore >= 80
                  ? 'report-card__score--high'
                  : report.matchScore >= 60
                  ? 'report-card__score--mid'
                  : 'report-card__score--low'
              }`}
            >
              {report.matchScore}%
            </span>
          </div>
          <p className="report-card__date">
            Generated on {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </button>
      ))}
    </div>
  </section>
)}
      <footer className="home__footer">
        
         
        
      </footer>
    </main>
  )
}

export default Home