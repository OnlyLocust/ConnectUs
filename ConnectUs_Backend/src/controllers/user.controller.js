import mongoose from "mongoose";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { getPublicIdFromUrl } from "../utils/cloudinary.js";
import { onlineUsers } from "../socket/onlineUsers.js";

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


export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const { username, gender, bio } = req.body;
    const file = req.file;

    if (!username && !gender && !bio && !file) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let changes = false;
    let oldProfilePicture = null;

    if (username && username !== user.username) {
      user.username = username;
      changes = true;
    }

    if (gender && gender !== user.gender) {
      user.gender = gender;
      changes = true;
    }

    if (bio && bio !== user.bio) {
      user.bio = bio;
      changes = true;
    }

    if (file) {
      const result = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
                folder: "social-media/profile-pictures",
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            )
            .end(file.buffer);
        }
      );

      oldProfilePicture = user.profilePicture;

      user.profilePicture = result.secure_url;

      changes = true;
    }

    if (!changes) {
      return res.status(200).json({
        success: true,
        message: "No changes detected",
        user,
      });
    }

    await user.save();

    if (oldProfilePicture) {
      try {
        const publicId =
          getPublicIdFromUrl(oldProfilePicture);

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error(
          "Failed to delete old profile picture:",
          error
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


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