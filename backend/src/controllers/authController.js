const userModle = require("../models/userModel");
const  tokenBlackListModel = require("../models/tokenBlackListModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/**
 * @Name registerUser
 * @description reister  a new user,expect email,userName and password
 * @access Publci
 */
async function registerUser(req, res) {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res
      .status(400)
      .json({ message: "plese provide userName email password" });
  }
  const userAlreadyExist = await userModle.findOne({
    $or: [{ userName }, { email }],
  });

  if (userAlreadyExist) {
    if (userAlreadyExist.userName === userName) {
      return res.status(400).json({ message: "userName already exist" });
    } else if (userAlreadyExist.email === email) {
      return res.status(400).json({ message: "email already registered" });
    }
  }
  const hash = await bcrypt.hash(password, 10);

  const user = await userModle.create({
    userName,
    email,
    password: hash,
  });

  const token=jwt.sign(
    {id:user._id,userNmae:user.userName},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
  )
  res.cookie("token",token)
  res.status(200).json({message:"user registered successfully",
    user:{
      id:user._id,
      userName:user.userName,
      email:user.email
    }
  })
}
/**
 * @name loginUser
 * @description user login her,expect email and password
 * @access Public
 */
async function loginUser(req,res){
const {email,password}=req.body
const user= await userModle.findOne({email})
if(!user){
 return res.status(400).json({message:"user does not exist"})
}

const compare= await bcrypt.compare(password,user.password)

if(!compare){
return res.status(400).json({message:"password does not match"})
}
const token=jwt.sign(
  {id:user._id,userName:user.userName},
process.env.JWT_SECRET,
{expiresIn:"1d"}
)
res.cookie("token",token)

 return res.status(200).json({message:"logedIn successfully",
  user:{
    id:user._id,
    userName:user.userName,
    email:user.email
  }
})
}

/**
 * @name logOutUser
 * @description deleting token and blackListing them in mongoDB
 * @access Public
 */
async function logoutUser(req,res){
const token=req.cookies.token
if(token){
  await tokenBlackListModel.create({token})
}
 res.clearCookie("token")

 res.status(200).json({message:"user log out successfully"})

}
/**
 * @name getMe
 * @description giving information of user 
 * @access Private
 */
async function getMe(req,res) {
  const user=await userModle.findById(req.user.id)

  return res.status(200).json({
    message:"user detail fetch successfully",
user:{
  id:user._id,
  userName:user.userName,
  email:user.email
}
  })
}


module.exports = { registerUser, loginUser, logoutUser,getMe};
