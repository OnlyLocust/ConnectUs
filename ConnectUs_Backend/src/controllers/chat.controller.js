import Chat from "../models/chat.model.js";

export const getMessages = async (req, res) => {
  try {
    const { recvId } = req.params;
    const userId = req.userId;

    const chat = await Chat.findOne({
      members: {
        $all: [userId, recvId],
        $size: 2,
      },
    })
      .select("messages")
      .populate({
        path: "messages",
        select: "message sender createdAt",
        options: {
          sort: { createdAt: 1 },
        },
      });

    if (!chat) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    const messages = chat.messages.map((msg) => ({
      _id: msg._id,
      message: msg.message,
      createdAt: msg.createdAt,
      isSender: msg.sender.toString() === userId,
    }));

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addChat = async (req, res) => {
  try {
    const userId = req.userId;
    const { recvId } = req.body;

    if (!recvId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    let chat = await Chat.findOne({
      members: {
        $all: [userId, recvId],
        $size: 2,
      },
    }).select("_id");

    if (!chat) {
      chat = await Chat.create({
        members: [userId, recvId],
        notRead: {
          [userId.toString()]: 0,
          [recvId.toString()]: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      chatId: chat._id,
    });
  } catch (error) {
    console.error("Create Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const chatUsers = async (req, res) => {
  try {
    const userId = req.userId;

    const chats = await Chat.find({
      members: userId,
    })
      .select("members lastMessage updatedAt notRead")
      .populate(
        "members",
        "username profilePicture lastSeen"
      )
      .sort({ updatedAt: -1 });

    const chatUsers = chats.map((chat) => {
      const otherMember =
        chat.members[0]._id.toString() === userId
          ? chat.members[1]
          : chat.members[0];

      return {
        _id: chat._id,
        member: {
          _id: otherMember._id,
          username: otherMember.username,
          profilePicture: otherMember.profilePicture,
          lastSeen: otherMember.lastSeen,
        },
        lastMessage: chat.lastMessage,
        updatedAt: chat.updatedAt,
        notRead: chat.notRead.get(userId.toString()) || 0,
      };
    });

    return res.status(200).json({
      success: true,
      chatUsers,
    });
  } catch (error) {
    console.error("Get Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};