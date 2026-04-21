const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const blacklistModel = require('../models/blacklist.model')

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (isAlreadyRegistered) {
    return res.status(400).json({
      message: "user with the same email or username is already exists",
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashed,
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User Registered Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password, username } = req.body;
  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  }).select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "invalid crdentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "User LoggedIn Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

const getMe = async (req, res) => {
  const user = await userModel.findById(req.user.id);

  if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
}

  res.status(200).json({
    message: "user fetched successfully",
    user,
  });
};


const logoutUser = async(req,res)=>{
 const token = req.cookies.token
 res.clearCookie("token")

 await blacklistModel.create({
    token
 })

 res.status(200).json({
    message: "logout Successfully"
 })
}

module.exports = { registerUser, loginUser, getMe , logoutUser};
