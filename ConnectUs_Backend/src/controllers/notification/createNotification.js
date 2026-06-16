import Notification from "../../models/notification.model.js";
import User from "../../models/user.model.js";


export const createNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { recvId } = req.params;
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        message: "Action is required",
      });
    }

    const notification = await Notification.create({
      actor: userId,
      action,
    });

    await User.findByIdAndUpdate(
      recvId,
      {
        $push: {
          "notifications.notification": {
            $each: [notification._id],
            $position: 0,
          },
        },
        $inc: {
          "notifications.notRead": 1,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Notification added",
    });
  } catch (error) {
    console.error("Create Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
