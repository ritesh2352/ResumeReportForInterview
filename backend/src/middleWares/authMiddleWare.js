const jwt = require("jsonwebtoken");
require("dotenv").config(); 
const tokenBlackListModel =require('../models/tokenBlackListModel')
async function authUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(400).json({ message: "token not provided" });
  }
 const isTokenBlackListed=await tokenBlackListModel.findOne({token})
 if(isTokenBlackListed){
  return res.status(400).json({message:"token is invalid"})
 }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "invalid token" });
  }
}

module.exports={authUser}