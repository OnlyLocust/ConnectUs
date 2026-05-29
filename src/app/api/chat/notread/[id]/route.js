import Chat from "@/models/chat.model";
import { NextResponse } from "next/server";
import { eventBus, EVENTS } from "@/app/api/utils/eventBus";

export const PATCH = async (req, { params }) => {
  try {
    const { id: chatId } = await params;
    const userId = req.headers.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json({ message: "Chat not found", success: false }, { status: 404 });
    }

    // Set notRead[userId] = 0
    chat.notRead.set(userId, 0);

    await chat.save();

    const recvId = chat.members.find((m) => m.toString() !== userId)?.toString();

    eventBus.emit(EVENTS.MESSAGE_READ, { chatId, userId, recvId });

    return NextResponse.json({ message: "Marked as read", success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message, success: false }, { status: 500 });
  }
};
