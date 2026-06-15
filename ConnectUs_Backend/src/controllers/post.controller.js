import Post from "../models/post.model.js";
import User from "../models/user.model.js"
import Comment from "../models/comment.model.js";
import { eventBus, EVENTS } from "../utils/eventBus.js";
import { getPublicIdFromUrl } from "../utils/cloudinary.js";
import cloudinary from "../config/cloudinary.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .select("caption image")
      .lean();

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Get Posts Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const toggleBookmark = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const user = await User.findById(userId)
      .select("bookmarks");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isBookmarked = user.bookmarks.some(
      (bookmark) => bookmark.toString() === postId
    );

    if (isBookmarked) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            bookmarks: postId,
          },
        }
      );

      return res.status(200).json({
        success: true,
        bookmarked: false,
        message: "Unbookmark successful",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          bookmarks: postId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      bookmarked: true,
      message: "Bookmark successful",
    });
  } catch (error) {
    console.error("Toggle Bookmark Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const post = await Post.findById(postId)
      .populate("author", "username profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const skipValue = 4;

export const getHomePosts = async (req, res) => {
  
  try {
    const id = req.userId; // set by auth middleware

    if (!id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const before = req.query.before;
    const limit = parseInt(req.query.limit) || 4;

    let query = {};

    if (before) {
      query.createdAt = {
        $lt: new Date(before),
      };
    }

    let queryExec = Post.find(query)
      .populate("author", "username profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      })
      .sort({ createdAt: -1 });

    if (!before) {
      const skip = parseInt(req.query.skip) || 0;

      queryExec = queryExec.skip(skip * skipValue);
    }

    const posts = await queryExec.limit(limit);

    return res.status(200).json({
      message: "Posts fetched successfully",
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};


export const addComment = async (req, res) => {

  try {
    const userId = req.userId;

    const { text, optimisticId } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Comment text is required",
        success: false,
      });
    }

    const { postId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
        success: false,
      });
    }

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: comment._id,
        },
      },
      {
        new: true,
      }
    );

    const populatedComment = await Comment.findById(
      comment._id
    ).populate(
      "author",
      "username profilePicture"
    );

    eventBus.emit(EVENTS.COMMENT_ADDED, {
      postId,
      actorId: userId,
      recipientId: post ? post.author : null,
      comment: populatedComment,
      optimisticId,
    });

    return res.status(200).json({
      message: "Comment added successfully",
      success: true,
      comment: populatedComment,
      optimisticId,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};


export const likeUnlikePost = async (req, res) => {
  
  try {
    const { postId } = req.params;
    const id = req.userId; // assuming auth middleware sets req.userId

    if (!id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
        success: false,
      });
    }

    const { like } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    if (like === "like") {
      // Prevent duplicate likes
      if (!post.likes.includes(id)) {
        post.likes.push(id);
        await post.save();
      }

      eventBus.emit(EVENTS.POST_LIKED, {
        postId,
        actorId: id,
        recipientId: post.author,
        doLike: true,
      });

      return res.status(200).json({
        message: "Like successful",
        success: true,
      });
    }

    post.likes = post.likes.filter(
      (likeId) => likeId.toString() !== id
    );

    await post.save();

    eventBus.emit(EVENTS.POST_LIKED, {
      postId,
      actorId: id,
      recipientId: post.author,
      doLike: false,
    });

    return res.status(200).json({
      message: "Unlike successful",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deletePost = async (req, res) => {

  try {
    const { postId } = req.params;
    const id = req.userId; // set by auth middleware

    if (!id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
        success: false,
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isHisPost = user.posts.some(
      (post) => post.toString() === postId
    );

    if (!isHisPost) {
      return res.status(403).json({
        message: "You can only delete your own posts",
        success: false,
      });
    }

    // Remove post from user's posts array
    user.posts = user.posts.filter(
      (post) => post.toString() !== postId
    );

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Delete image from Cloudinary
    try {
      const publicId = getPublicIdFromUrl(deletedPost.image);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (cloudinaryError) {
      console.error(
        "Failed to delete image from Cloudinary:",
        cloudinaryError
      );
    }

    // Delete all comments related to the post
    await Comment.deleteMany({
      _id: { $in: deletedPost.comments },
    });

    // Remove bookmarks from all users
    await User.updateMany(
      { bookmarks: postId },
      {
        $pull: {
          bookmarks: postId,
        },
      }
    );

    await user.save();

    eventBus.emit(EVENTS.POST_DELETED, {
      postId,
      authorId: id,
      followers: user.followers
        ? user.followers.map((f) => f.toString())
        : [],
    });

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};