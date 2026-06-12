import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getMe = async (req, res) => {
  try {
    const objectUserId = new mongoose.Types.ObjectId(req.userId);

    const userWithCounts = await User.aggregate([
      {
        $match: {
          _id: objectUserId,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "posts",
          foreignField: "_id",
          as: "posts",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "bookmarks",
          foreignField: "_id",
          as: "bookmarks",
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          profilePicture: 1,
          followers: 1,
          following: 1,

          posts: {
            $map: {
              input: "$posts",
              as: "post",
              in: {
                _id: "$$post._id",
                image: "$$post.image",
                likeCount: {
                  $size: "$$post.likes",
                },
                commentCount: {
                  $size: "$$post.comments",
                },
              },
            },
          },

          bookmarks: {
            $map: {
              input: "$bookmarks",
              as: "post",
              in: {
                _id: "$$post._id",
                image: "$$post.image",
                likeCount: {
                  $size: "$$post.likes",
                },
                commentCount: {
                  $size: "$$post.comments",
                },
              },
            },
          },
        },
      },
    ]);

    const user = userWithCounts?.[0];

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

const getFollowData = async (
  req,
  res,
  field
) => {
  const { userId } = req.params;
  
  const user = await User.findById(userId)
    .select(`${field} username profilePicture`)
    .populate(
      field,
      "username profilePicture"
    )
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    userData: {
      username: user.username,
      profilePicture: user.profilePicture,
    },
    followData: user[field],
  });
};

export const getFollowers = (req, res) =>
  getFollowData(req, res, "followers");

export const getFollowing = (req, res) =>
  getFollowData(req, res, "following");