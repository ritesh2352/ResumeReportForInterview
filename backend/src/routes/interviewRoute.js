const express = require('express')
const authMiddleware = require('../middleWares/authMiddleWare')
const interviewController = require('../controllers/interviewController')
const upload = require('../middleWares/fileMiddleware')

const interviewRouter = express.Router()

/**
 * @route api/interview/
 * @description genrate interview report on the bases of resume self description and job Description form user
 * @access private
 */

interviewRouter.post('/',authMiddleware.authUser,upload.single('resume'),interviewController.generateInterviewReportController)

/**
 * @route api/interview/report/:interviewId
 * @description this find the interview by id which is porvided by url
 * @access Private
 */

interviewRouter.get('/report/:interviewId',authMiddleware.authUser,interviewController.getInterviewReportById)

/**
 * @route api/interview/
 * @description this get all the interview reports 
 * @access Private
 */

interviewRouter.get('/',authMiddleware.authUser,interviewController.getAllInterviewReports)

module.exports = interviewRouter;