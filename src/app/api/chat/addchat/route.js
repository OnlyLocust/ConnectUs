import Chat from "@/models/chat.model";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const id = req.headers.get("userId");
    const { recvId } = await req.json();

    let chat = await Chat.findOne({
      members: { $all: [id, recvId], $size: 2 },
    });

    if (!chat) {
      chat = await Chat.create({
        members: [id, recvId],
        notRead: {
          [id.toString()]: 0,
          [recvId.toString()]: 0,
        },
      });
    }

    console.log(chat);

    return NextResponse.json(
      { chatId: chat._id, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
