const express = require('express')
const cors = require('cors')
const cookieParser=require("cookie-parser")

const app=express()

/* requre all the routes here */
const authRouter=require('./routes/authRoute')
const interviewRouter= require('./routes/interviewRoute')

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

/*use all the routes here */
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)



module.exports=app