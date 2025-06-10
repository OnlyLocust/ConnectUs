import Chat from "@/models/chat.model";
import { NextResponse } from "next/server";

export const PATCH = async (req, { params }) => {
  try {
    const { id: chatId } = params;
    const userId = req.headers.get("userId");

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json({ message: "No chat found", success: false }, { status: 404 });
    }

    // Set notRead[userId] = 0
    chat.notRead.set(userId, 0);

    await chat.save();

    return NextResponse.json({ message: "Marked as read", success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message, success: false }, { status: 500 });
  }
};
