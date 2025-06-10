import Chat from "@/models/chat.model";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const id = req.headers.get("userId");
    const chats = await Chat.find({ members: id })
      .select(`members lastMessage updatedAt notRead`)
      .populate("members", "name username profilePicture");

    const chatUsers = chats.map((chat) => {
      if (chat.members[0]._id.toString() === id) {
        return {
          _id: chat._id,
          member: {
            _id: chat.members[1]._id,
            username: chat.members[1].username,
            profilePicture: chat.members[1].profilePicture,
          },
          lastMessage: chat.lastMessage,
          updatedAt: chat.updatedAt,
          notRead: chat.notRead.get(id.toString()),
        };
      } else if (chat.members[1]._id.toString() === id) {
        return {
          _id: chat._id,
          member: {
            _id: chat.members[0]._id,
            username: chat.members[0].username,
            profilePicture: chat.members[0].profilePicture,
          },
          lastMessage: chat.lastMessage,
          updatedAt: chat.updatedAt,
          notRead: chat.notRead.get(id.toString()),
        };
      }
    });

    return NextResponse.json({ chatUsers, success: true }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
