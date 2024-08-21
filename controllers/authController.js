const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
    const { username, email, password, accountType } = req.body;
    try {
        let user = await User.findOne({ username: username });
        if(user){
            return res.status(400).json({success: false, message: "Username already in use"});
        }
        const securePassword = await bcrypt.hash(password, 10);

        user  = new User({
            username,
            email,
            password: securePassword,
            accountType,
        })
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const login = async (req, res) => {

};



module.exports = { login, signup };