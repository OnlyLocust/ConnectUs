import mongoose from "mongoose";
import Message from "./message.model";
import User from "./user.model";

const chatSchema = new mongoose.Schema(
    {   
        members:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        messages:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            },
        ],
        lastMessage:{
            type:String,
            default:"Start a Converzation"
        }
    },
    {
        timestamps:true
    }
)

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default Chat;