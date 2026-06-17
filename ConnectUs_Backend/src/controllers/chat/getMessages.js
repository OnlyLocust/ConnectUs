import Chat from "../../models/chat.model.js";


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
      })
      .lean();

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