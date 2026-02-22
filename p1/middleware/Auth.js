import { json } from "express";
import { User } from "../models/User.model.js";
import jwt  from "jsonwebtoken";

const auth_user=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
    if(!token){
        return res.status(401).json({"message":"Token is mmissing"})
    }
    const decode=jwt.verify(token,process.env.VERIFY_TOKEN_SECRET);
    const user=User.findById(decode?.id).select("-password");
    if(!user){
       return res.status(401).json({"message":"invalid token"});
    }
    req.user=user;
    next();


    } catch (error) {
         return res.status(500).json({"message":`Internal server error ${error}`});
    }
}
export default auth_user;