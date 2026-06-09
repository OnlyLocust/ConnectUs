import Notification from "@/models/notification.model";
import User from "@/models/user.model";

export const createAndSendNotification = async (actorId, recvId, action) => {
  try {
    if (!actorId || !recvId || actorId.toString() === recvId.toString()) {
      return;
    }

    const notification = await Notification.create({
      actor: actorId,
      action,
    });

    if (!notification) {
      console.error("Failed to create notification in DB");
      return;
    }

    await User.findByIdAndUpdate(recvId, {
      $push: {
        "notifications.notification": {
          $each: [notification._id],
          $position: 0,
        },
      },
      $inc: {
        "notifications.notRead": 1,
      },
    });

    const populatedNotification = await Notification.findById(notification._id).populate(
      "actor",
      "username profilePicture"
    );

    if (global.io && populatedNotification) {
      global.io.to(recvId.toString()).emit("notification", populatedNotification);
    }
  } catch (error) {
    console.error("Error creating/sending notification:", error);
  }
};
