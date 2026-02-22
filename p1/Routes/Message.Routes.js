import express from "express";
import { User_auth } from "../Utils/User_auth.js";
import { Get_all_User_profiles, get_messase, mark_message_as_seen } from "../controllers/Message.controller.js";
import { send_message } from "../controllers/Message.controller.js";


const messagerouter=express.Router();
messagerouter.get("/all-user",User_auth,Get_all_User_profiles);
messagerouter.get("/message/:id",User_auth,get_messase);
messagerouter.put("/mark-as-seen/:id",User_auth,mark_message_as_seen);
messagerouter.post("/send/:id",User_auth,send_message);

export default messagerouter;