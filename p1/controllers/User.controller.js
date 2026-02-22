import { User } from "../models/User.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import auth_user from "../middleware/Auth.js";
import { sendVerificationEmail } from "../Utils/Verifyemail.js";
import { sendVerificationEmail_forgotpassword } from "../Utils/forgot_password_email.js";
import cloudinary from "../Utils/Cloudinary.js";

const User_Signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const token = jwt.sign(
      { email },
      process.env.VERIFY_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const newUser = new User({
      name,
      email,
      password,
      token,
      isverified: false
    });

    // 👉 Send email FIRST
    await sendVerificationEmail(email, token);

    // 👉 Save only if email success
    const user = await newUser.save();

    const createduser = await User.findById(user._id).select("-password -token");

    res.status(201).json({
      message: "Verification email sent. Please verify your email.",
      createduser,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message || "Signup failed",
    });
  }
};

const User_verifyemail = async (req, res) => {
  try {
    const { code } = req.body;

    // verify token
    const decoded = jwt.verify(code, process.env.VERIFY_TOKEN_SECRET);

    // find user using token email
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isverified) {
      return res.status(200).json({ message: "Already verified" });
    }

    user.isverified = true;
    user.token = undefined; // optional cleanup
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    console.error("VERIFY ERROR:", error.message);
    return res.status(400).json({ message: "Invalid or expired verification link" });
  }
}; 


const User_sign_in = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // 3. Email verification check
    if (!user.isverified) {
      return res.status(403).json({
        message: "Please verify your email before logging in"
      });
    }

    // 4. Password check
    console.log(password, user.password); // Debugging line
    const isPassCorrect = await user.isspasswordcorrect(password);
    if (!isPassCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // 5. Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.LOGIN_TOKEN_SECRET || process.env.VERIFY_TOKEN_SECRET,
      { expiresIn: "4d" }
    );

    // 6. Cookie options
    const options = {
      httpOnly: true,
      secure: false,         // true in production (https)// 4 days
      sameSite: "lax",  
      }  

    // 7. Remove sensitive data
    user.password = undefined;
    user.token = undefined;

    // 8. Send response
    res
      .status(200)
      .cookie("token", token, options)
      .json({
        message: "Login successful",
        user
      });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
const forgot_password=async(req,res)=>{
    try {
      const {email}=req.body;
      if(!email){
        res.status(401).json({"messsage":"please enter email"});
      }
      const user=await User.findOne({email:email});
      if(!user){
        res.status(401).json({"messsage":"user not exist"});
      }
      const tokeen=jwt.sign({
        "id":user._id,"email":user.email
      },process.env.VERIFY_TOKEN_SECRET,{expiresIn:"10m"});
      await sendVerificationEmail_forgotpassword(user.email,tokeen);
      res
      .json({"message":"email sent succesfully change password"});
    } catch (error) {
      res.status(500).json({"message":"somthing went wrong"})
    }
  
  }
  const reset_password=async(req,res)=>{
    try {
      const {token,password}=req.body;

      const decoded=jwt.verify(token,process.env.VERIFY_TOKEN_SECRET);
      const user=await User.findById(decoded.id);
      if(!user){
        return res.status(404).json({"message":"user not found"});
      }
      user.password=password;
      await user.save();
      res.json({"message":"password reset successfully"});
    } catch (error) {
      res.status(500).json({"message":"something went wrong"})
    }
  
  }

const Update_profile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const userid = req.user._id;

    const user = await User.findById(userid).select("-password -token");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;

    if (req.file) {
      user.profilepic = req.file.path; // Cloudinary URL
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};




export { User_Signup, User_verifyemail, User_sign_in,reset_password,forgot_password,Update_profile};