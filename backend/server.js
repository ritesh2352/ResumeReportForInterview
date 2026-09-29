require('dotenv').config()
const app=require('./src/app.js')
const connectToDB=require('./src/config/database')

const PORT=(process.env.PORT) 
connectToDB()

app.listen(PORT, '0.0.0.0',()=>{
  console.log("server is running on port 3000")
})