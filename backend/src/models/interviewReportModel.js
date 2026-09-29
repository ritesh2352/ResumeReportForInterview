const mongoose = require('mongoose')

const technicalQuestionSchema = new mongoose.Schema({
  question:{
    type:String,
    required:[true,"question is required"]
  },
  intention:{
    type:String,
    required:[true,"Intention is required"]
  },
  answer:{
    type:String,
    required:[true,"anwer is required"]
  }
},{
  _id:false
})

const skillGapSchema = new mongoose.Schema({
  skill:{
    type:String,
    required:[true,"skill is required"]
  },
  severity:{
    type:String,
    enum:["low","medium","high"],
    required:[true,"severity is required"]
  }
},{
  _id:false
})
const behaviouralQuestionSchema = new mongoose.Schema({
   question:{
    type:String,
    required:[true,"question is required"]
  },
  intention:{
    type:String,
    required:[true,"Intention is required"]
  },
  answer:{
    type:String,
    required:[true,"anwer is required"]
  }
},{
  _id:false
})

const preparationPlanSchema = new mongoose.Schema({
  day:{
    type:Number,
    required:[true,"day is required"]
  },
  focus:{
    type:String,
    required:[true,"focus is required"]
  },
  task:{
    type:[String],
    required:[true,"task is requried"]
  }
})
const interviewReportSchema = new mongoose.Schema({
  jobDescription:{
    type:String,
    required:[true,"job Description is required"]
  },
  resume:{
    type:String
  },
  selfDescription:{
    type:String
  },
  matchScore:{
    type:Number,
    min:0,
    max:100
  },
  title: {
  type: String
},
  technicalQuestions:[technicalQuestionSchema],
  behaviouralQuestions:[behaviouralQuestionSchema],
  skillGaps:[skillGapSchema],
  preparationPlan:[preparationPlanSchema],
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users',
    required:[true,"user id is required"]
  }
},{
  timestamps:true
})

const interviewReportModel = mongoose.model("interviewReport",interviewReportSchema)

module.exports = interviewReportModel