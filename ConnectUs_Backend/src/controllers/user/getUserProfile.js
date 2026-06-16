import mongoose from "mongoose";
import User from "../../models/user.model.js";
import { onlineUsers } from "../../socket/onlineUsers.js";


export const getUserProfile = async (req, res) => {
  
  try {
    const profileId = req.params.id;

    const objectUserId =
      new mongoose.Types.ObjectId(profileId);

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
          lastSeen: 1,
          bio: 1,
          gender: 1,

          followerCount: {
            $size: {
              $ifNull: ["$followers", []],
            },
          },

          followingCount: {
            $size: {
              $ifNull: ["$following", []],
            },
          },

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

    const user = userWithCounts[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.online =
      onlineUsers?.has(profileId) || false;

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