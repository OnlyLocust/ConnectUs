import User from "../../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const userId = req.userId;

    const users = await User.find({
      _id: { $ne: userId },
    })
      .select("username profilePicture")
      .lean();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};