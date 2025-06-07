import Chat from "@/models/chat.model";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    const { id: recvId } = await params;
    const userId = req.headers.get("userId");

    let messages = await Chat.findOne({
      members: { $all: [userId, recvId], $size: 2 },
    })
      .select("messages")
      .populate("messages");

    if (!messages) {
      return NextResponse.json(
        {messages: { messages: [] }, success: true },
        { status: 200 }
      );
    }

    const formattedMessages = messages.messages.map((msg) => {
      return {
        _id: msg._id,
        message: msg.message,
        createdAt: msg.createdAt,
        isSender: msg.sender.toString() === userId,
      };
    });
    

    return NextResponse.json(
      {
        messages: formattedMessages,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
