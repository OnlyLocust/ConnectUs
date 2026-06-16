import User from "../../models/user.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .select("notifications")
      .populate({
        path: "notifications.notification",
        populate: {
          path: "actor",
          select: "username profilePicture",
        },
      })
      .lean();

    return res.status(200).json({
      success: true,
      notifications: user?.notifications || [],
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};