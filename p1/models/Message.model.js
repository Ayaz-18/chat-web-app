import mongoose,{Schema} from "mongoose";
const message=new Schema({
    senderid:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        require:true
    },
    recevierid:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        require:true
        },
        text:{
            type:String,
            require:true
        },
        seen:{
            type:Boolean,
            default:false
        }

},{timestamps:true})
export const Message=new mongoose.model("Message",message)