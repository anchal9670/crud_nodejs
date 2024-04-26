require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 
const Token = require('../models/tokenModel');
const sendResponse = require('../utils/sendResponse');

// Function to register a new userd
const signUp = async (req, res) => {
  try {
    const { email, password ,phone, name } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullname:name,
      phone,
      email,
      password : hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to login a user
const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: `Invalid Email ${email}` });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    //refresh token
    const refreshToken = jwt.sign(
        {
            userId: user._id, 
            email: user.email,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "1w" }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        secure: true,
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    await Token.create({
        userId: user._id,
        token: refreshToken,
        expired_at,
    });

    const access_token = jwt.sign(
        {
            userId: user._id, 
            email: user.email,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "60m" }
    );
    res.header("Authorization", `Bearer ${access_token}`);
    res.status(200).json({
        success: true,
        access_token : access_token,
        refresh_token: refreshToken,
        userId : user._id,
        message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
//refresh token
const Refresh = async (req, res) => {
    try {
      const {refresh_token} = req.body;
      const payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
  
      if (!payload) {
        return res.status(401).send({
          message: "unauthenticated payload",
        });
      }
  
      const dbToken = await Token.findOne({
        userId: payload.id,
        expired_at: { $gte: new Date() },
      });
  
      if (!dbToken) {
        return res.status(401).send({
          success: false,
          message: "unauthenticated db token",
        });
      }
  
      const access_token = jwt.sign(
        { id: payload.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "60m" }
      );
  
      return res.status(200).json({
        success: true,
        access_token,
        refresh_token,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        error: error.message || "Internal Server Error",
      });
    }
};


const changePassword = async(req,res)=>{
  try{
    const userId = req.userId;
    console.log(userId);
    const {oldPassword , newPassword} = req.body;
    const user = await User.findById({_id:userId});
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid  Old Password' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const update = await User.findOneAndUpdate(
      {_id : userId},
      {
        password : hashedPassword
      },
      {new : true}
    );

    return sendResponse(res , 200 , 'Updated Successfully', update);

  }catch(error){
    console.log(error);
    return sendResponse(res, 500,'Internal Server Error')
  }
}

//logout
const logout = async (req, res) => {
  try{
    res.cookie("refreshToken", "", { maxAge: 0 });
    return res.status(200).json({
      success: true,
      message: "success",
    });
  }catch(error){
    console.log(error);
    return sendResponse(res, 500,'Internal Server Error')
  }
};

module.exports = { signUp, logIn , Refresh , changePassword , logout };
