import Post from "../../models/post.model.js";
import { eventBus, EVENTS } from "../../utils/eventBus.js";



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