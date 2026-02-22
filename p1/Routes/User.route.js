import { Router } from "express";
import { User_Signup, User_verifyemail, User_sign_in,reset_password,forgot_password,Update_profile} from "../controllers/User.controller.js";
import { User } from "../models/User.model.js";
import { User_auth } from "../Utils/User_auth.js";
import upload from "../Utils/Multer.js";

const userrouter = Router();
// Define user-related routes here
userrouter.post("/signup",User_Signup);
userrouter.post("/signin",User_sign_in);
userrouter.post("/verify",User_verifyemail);
userrouter.put(
  "/update-profile",
  upload.single("profilepic"),
  User_auth,
  Update_profile
);
userrouter.post("/forgot-password",forgot_password);
userrouter.post("/reset-password",reset_password);
// userrouter.get("/profile",User_auth,Get_User_profile);
// userrouter.get("/all-profile",)
export default userrouter;