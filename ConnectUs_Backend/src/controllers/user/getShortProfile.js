import User from "../../models/user.model.js";


export const getShortProfile = async (req, res) => {
  try {
    const id = req.userId; // set by auth middleware

    const user = await User.findById(id)
      .populate("posts")
      .populate("bookmarks");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};