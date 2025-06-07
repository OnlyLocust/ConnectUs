import Chat from "@/models/chat.model";
import Message from "@/models/message.model";
import { NextResponse } from "next/server";

export const POST = async (req,{params}) => {
  try {
    const { id: recvId } = await params;
    const userId = req.headers.get("userId");
    const {message} = await req.json()

    const addMessage = await Message.create({
        sender:userId,
        receiver:recvId,
        message
    })

    if(!addMessage){
        return NextResponse.json({message:"failed to make a message",success:false},{status:400})
    }

    let chat = await Chat.findOne({
      members: { $all: [userId, recvId] },
    });

    if (!chat) {
      chat = await Chat.create({
        members: [userId, recvId],
      });
    }

    chat.messages.push(addMessage._id)
    chat.lastMessage=message

    await chat.save()

    return NextResponse.json({chat,success:true},{status:200})


  } catch (error) {
    return NextResponse.json({message:error.message, success:false},{status:500})
  }
};
