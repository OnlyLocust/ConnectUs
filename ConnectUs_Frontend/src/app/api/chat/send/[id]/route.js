import Chat from "@/models/chat.model";
import Message from "@/models/message.model";
import { NextResponse } from "next/server";
import { eventBus, EVENTS } from "@/app/api/utils/eventBus";

export const POST = async (req,{params}) => {
  try {
    const { id: recvId } = await params;
    const userId = req.headers.get("userId");
    const {message, optimisticId} = await req.json()

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
        notRead: {
          [userId.toString()]: 0,
          [recvId.toString()]: 0,
        },
      });
    }

    chat.messages.push(addMessage._id)
    chat.lastMessage=message
    chat.notRead.set(recvId, (chat.notRead.get(recvId) || 0) + 1);

    await chat.save()

    eventBus.emit(EVENTS.MESSAGE_SENT, {
      messageId: addMessage._id.toString(),
      senderId: userId,
      receiverId: recvId,
      message: addMessage.message,
      createdAt: addMessage.createdAt,
      optimisticId,
    });

    return NextResponse.json({
      chat,
      success: true,
      optimisticId,
      messageId: addMessage._id.toString(),
      createdAt: addMessage.createdAt,
    }, { status: 200 });


  } catch (error) {
    return NextResponse.json({message:error.message, success:false},{status:500})
  }
};
