import Chat from "../../models/chat.model.js";
import { eventBus, EVENTS } from "../../utils/eventBus.js";


export const markChatAsRead = async (req, res) => {
  
  try {

    const chatId = req.params.id;
    const userId = req.userId;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Optional security check
    if (
      !chat.members.some(
        member => member.toString() === userId
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    chat.notRead.set(userId, 0);

    await chat.save();

    const recvId = chat.members
      .find(
        member =>
          member.toString() !== userId
      )
      ?.toString();

    eventBus.emit(EVENTS.MESSAGE_READ, {
      chatId,
      userId,
      recvId,
    });

    return res.status(200).json({
      success: true,
      message: "Marked as read",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};