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
            return res.status(400).json({ success: false, message: "Username already in use" });
        }
        const securePassword = await bcrypt.hash(password, 10);

        user = new User({
            username,
            email,
            password: securePassword,
            accountType,
        })

        await user.save();

        return res.status(201).json({ success: true, message: "new user created successfully" })
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Please signup" });
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) return res.status(400).json({ sucess: false, message: "Invalid credentials" });

        const data = {
            id: user._id,
            accountType: user.accountType,
            author: user.username,
        };

        const accessToken = generateAccessToken(data);

        const refreshToken = generateRefreshToken(data);

        return res.status(200).json({
            success: true, message: "Login successful",
            accessToken,
            refreshToken,
            role: user.accountType,
            author: user.username,
        })

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
};



module.exports = { login, signup };