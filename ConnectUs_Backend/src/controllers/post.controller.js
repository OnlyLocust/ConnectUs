import Post from "../models/post.model.js";
import User from "../models/user.model.js"

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