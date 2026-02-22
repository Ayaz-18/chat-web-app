import { User } from "../models/User.model.js";
import mongoose from "mongoose";
import { Message } from "../models/Message.model.js";
import { io } from "../App.js";
import { onlineUsers } from "../App.js";
const Get_all_User_profiles = async (req, res) => {
    try {
        const user = await User.find({ _id: { $ne: req.user._id } }).select("-password -token");
        const Usermessage = {}
        const message = user.map(async (u) => {
            const message = await Message.find({
                senderid: u._id,
                recevierid: req.user._id,
                seen: false
            }).sort({ createdAt: -1 }).limit(1);
            Usermessage[u._id] = message.length > 0 ? message[0] : null;
        })
        
        Promise.all(message).then(() => {
            console.log(user, Usermessage);
            res.json({ user, Usermessage });
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "something went wrong" })
    }
}
//get all message for selected user
const get_messase = async (req, res) => {
    try {
        const { id: selecteduserid } = req.params;
        const myid = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderid: selecteduserid, recevierid: myid },
                { senderid: myid, recevierid: selecteduserid }
            ]
        }).sort({ createdAt: 1 });
        await Message.updateMany({
            senderid: selecteduserid,
            recevierid: myid
        }, { seen: true })
        res.json({ messages });
    } catch (error) {
        res.status(500).json({ "message": "something went wrong" })
    }
}
//mark   message as seen
const mark_message_as_seen = async (req, res) => {
    try {
        const { id: selecteduserid } = req.params;
        const myid = req.user._id;
        await Message.updateMany({
            senderid: selecteduserid,
            recevierid: myid
        }, { seen: true })
        res.json({ "message": "marked as seen" });
    }
    catch (error) {
        res.status(500).json({ "message": "something went wrong" })
    }
}
const send_message = async (req, res) => {
  try {
    const { text } = req.body;
    const receiverid = req.params.id;
    const senderid = req.user._id;

    const newmessage = await Message.create({
      senderid,
      recevierid: receiverid,
      text,
      seen: false
    });

    const receiverSocketId = onlineUsers[receiverid];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-message", newmessage);
    }

    res.json(newmessage); // ✅ return only message object
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};


export { Get_all_User_profiles, get_messase, mark_message_as_seen,send_message }