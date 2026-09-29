const interviewReportModel = require('../models/interviewReportModel')
const {PDFParse}= require('pdf-parse')
const generateInterviewReport=require('../servises/aiServise')
const generateInterviewReportByGroq = require('../servises/groqAiServise')


/**
 * @description this genrate report by resume ,selfDescription and jobDescription
 */
async function generateInterviewReportController(req,res) {

  const {jobDescription,selfDescription}= req.body

let resumeContent = "";

if (req.file) {
  const parser = new PDFParse({ data: req.file.buffer });
  try {
    const result = await parser.getText();
    resumeContent = result.text?.trim() || "";
  } catch (err) {
    return res.status(400).json({ message: "Could not read the PDF file" });
  } finally {
    await parser.destroy();
  }
}

if (!resumeContent && !selfDescription?.trim()) {
  return res
    .status(400)
    .json({ message: "Resume or selfDescription is needed" });
}


// const interviewReportByAi = await generateInterviewReport({resumeContent,jobDescription,selfDescription})
const interviewReportByAi = await generateInterviewReportByGroq({resumeContent,jobDescription,selfDescription})


 const interviewReport = await interviewReportModel.create({
  user:req.user.id,
  resume:resumeContent,
  jobDescription,
  selfDescription,
  ...interviewReportByAi
 })

 return res.status(200).json({message:"Reasume report created successfully",interviewReport})

}

/**
 * @description controller to get interviewReport by id
 */

 async function getInterviewReportById(req,res) {
  const {interviewId} = req.params

const interviewReport = await interviewReportModel.findById({_id:interviewId , user:req.user.id})
  
 if(!interviewReport){
   return res.status(404).json({message:"interview Report not found"})
 }
  
 return res.status(200).json({message:"Interview report found successfully", interviewReport})

 }

/**
 * @description controller to get all the interview Reports of user
 */

async function  getAllInterviewReports(req,res){
const userId=req.user.id;

const interviewReports = await interviewReportModel.find({user:userId}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan")


return res.status(200).json({message:"reports retrive successfully",interviewReports})

}
module.exports={generateInterviewReportController,getInterviewReportById,getAllInterviewReports}