import mongoose from "mongoose";
import User from "../../models/user.model.js";


export const getSuggestions = async (req, res) => {
  try {
    const userId = req.userId;

    const suggestions = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: new mongoose.Types.ObjectId(userId),
          },
        },
      },
      {
        $sample: {
          size: 6,
        },
      },
      {
        $project: {
          username: 1,
          profilePicture: 1,
          lastSeen: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Get Suggestions Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};