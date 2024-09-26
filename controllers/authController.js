const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../helpers/accessToken");
const { generateRefreshToken } = require("../helpers/refreshToken");

const signup = async (req, res) => {
  const { username, email, password, accountType } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username already in use" });
    }
    const securePassword = await bcrypt.hash(password, 10);

    user = new User({
      username,
      email,
      password: securePassword,
      accountType,
    });
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Please signup" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentails" });

    const data = {
      id: user._id,
      accountType: user.accountType,
      author: user.username,
    };

    const accessToken = generateAccessToken(data);
    const refreshToken = generateRefreshToken(data);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      role: user.accountType,
      author: user.username,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const refreshToken = async(req, res) => {
  const refreshTokenForThisRequest = req.headers.authorization?.split(" ")[1];

  if(!refreshTokenForThisRequest) {
    return res.status(401).json({success: false, message: "Unauthorized, Please login!"});
  }

  try {
    jwt.verify(refreshTokenForThisRequest, process.env.REFRESH_TOKEN_SECRET, (err, user)=> {
    if(err) return res.status(403).json({success: false, message: err.message})

      const accessToken = generateAccessToken({
        id: user.id,
        message: "new access token",
        accountType: user.accountType,
        author: user.author,
      });

      const refreshToken = generateRefreshToken({
        id: user.id,
        message: "new refresh token",
        accountType: user.accountType,
        author: user.author,

      });

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        accessToken,
        refreshToken, 
        role: user.accountType,
        author: user.author,
      });
    });     
    
  } catch (error) {
    console.log(error);
    res.status(403).json({success: false, message: "Invalid refresh token"});
  }
}


module.exports = { login, signup, refreshToken };
