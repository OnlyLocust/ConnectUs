import Chat from "../../models/chat.model.js";
import Message from "../../models/message.model.js";
import { eventBus, EVENTS } from "../../utils/eventBus.js";



export const sendMessage = async (req, res) => {
  try {

    const recvId = req.params.id;
    const userId = req.userId;

    const {
      message,
      optimisticId,
    } = req.body;

    const addMessage = await Message.create({
      sender: userId,
      receiver: recvId,
      message,
    });

    if (!addMessage) {
      return res.status(400).json({
        success: false,
        message: "Failed to create message",
      });
    }

    let chat = await Chat.findOne({
      members: {
        $all: [userId, recvId],
      },
    });

    if (!chat) {
      chat = await Chat.create({
        members: [userId, recvId],
        notRead: {
          [userId]: 0,
          [recvId]: 0,
        },
      });
    }

    chat.messages.push(addMessage._id);

    chat.lastMessage = message;

    chat.notRead.set(
      recvId,
      (chat.notRead.get(recvId) || 0) + 1
    );

    await chat.save();

    eventBus.emit(EVENTS.MESSAGE_SENT, {
      messageId: addMessage._id.toString(),
      senderId: userId,
      receiverId: recvId,
      message: addMessage.message,
      createdAt: addMessage.createdAt,
      optimisticId,
    });

    return res.status(200).json({
      success: true,
      chat,
      optimisticId,
      messageId: addMessage._id.toString(),
      createdAt: addMessage.createdAt,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
