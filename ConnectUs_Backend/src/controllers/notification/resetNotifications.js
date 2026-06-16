import User from "../../models/user.model.js";
import { eventBus, EVENTS } from "../../utils/eventBus.js";


export const resetNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "notifications.notRead": 0,
        },
      }
    );

    eventBus.emit(
      EVENTS.NOTIFICATION_RESET,
      { userId }
    );

    return res.status(200).json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
};