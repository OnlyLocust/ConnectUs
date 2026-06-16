import Post from "../../models/post.model.js";
import Comment from "../../models/comment.model.js";
import { eventBus, EVENTS } from "../../utils/eventBus.js";



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