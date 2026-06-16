import Post from "../../models/post.model.js";
import User from "../../models/user.model.js"
import Comment from "../../models/comment.model.js";
import { eventBus, EVENTS } from "../../utils/eventBus.js";
import { getPublicIdFromUrl } from "../../utils/cloudinary.js";
import cloudinary from "../../config/cloudinary.js";


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
