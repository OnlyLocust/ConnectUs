import mongoose from "mongoose";
import User from "../../models/user.model.js";

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