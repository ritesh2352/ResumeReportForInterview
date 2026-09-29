const userModel = require("../models/userModel");
const tokenBlackListModel = require("../models/tokenBlackListModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,                    // HTTPS only in production
  sameSite: isProd ? "none" : "lax", // cross-domain on Render, simple locally
  maxAge: 24 * 60 * 60 * 1000,       // 1 day, matches the JWT expiry
};

function signToken(user) {
  return jwt.sign(
    { id: user._id, userName: user.userName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

async function registerUser(req, res) {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ message: "please provide userName, email and password" });
    }

    const userAlreadyExist = await userModel.findOne({
      $or: [{ userName }, { email }],
    });

    if (userAlreadyExist) {
      if (userAlreadyExist.userName === userName) {
        return res.status(400).json({ message: "userName already exists" });
      }
      return res.status(400).json({ message: "email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ userName, email, password: hash });

    res.cookie("token", signToken(user), cookieOptions);

    return res.status(201).json({
      message: "user registered successfully",
      user: { id: user._id, userName: user.userName, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "please provide email and password" });
    }

    const user = await userModel.findOne({ email });
    const match = user && (await bcrypt.compare(password, user.password));

    if (!match) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    res.cookie("token", signToken(user), cookieOptions);

    return res.status(200).json({
      message: "logged in successfully",
      user: { id: user._id, userName: user.userName, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function logoutUser(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      await tokenBlackListModel.create({ token });
    }

    const { maxAge, ...clearOptions } = cookieOptions; // same options, minus maxAge
    res.clearCookie("token", clearOptions);

    return res.status(200).json({ message: "user logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({
      message: "user detail fetched successfully",
      user: { id: user._id, userName: user.userName, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

module.exports = { registerUser, loginUser, logoutUser, getMe };