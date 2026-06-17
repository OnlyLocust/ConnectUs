import Chat from "../../models/chat.model.js";


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
      .sort({ updatedAt: -1 })
      .lean();

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
        notRead: (chat.notRead instanceof Map ? chat.notRead.get(userId.toString()) : chat.notRead?.[userId.toString()]) || 0,
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