import axios from "axios";


const api=axios.create({
  baseURL:"http://localhost:3000",
  withCredentials:true
})

/**
 * @description servise to generate Interview Reports
 */

export const generateInterviewReport = async ({resumeFile,selfDescription,jobDescription}) =>{

  const formData = new FormData()
  formData.append("jobDescription",jobDescription)
  formData.append("selfDescription",selfDescription)
  formData.append("resume",resumeFile)

  
  const response = await api.post("api/interview/",formData,{
    headers:{"Content-Type": "multipart/form-data"}
  })
  return response.data
}

/**
 * @description servies to get Interview Report by Id
 */
export const getInterviewReportById = async ({interviewId})=>{

  const response = await api.get(`/api/interview/report/${interviewId}`)

  return response.data
}

/**
 * @description servise to get all the interview Reposts 
 */

export const getAllInterviewReports = async ()=>{
const response = await api.get('/api/interview/')

return response.data
}