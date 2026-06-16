import Post from "../../models/post.model.js";
import User from "../../models/user.model.js"
import { eventBus, EVENTS } from "../../utils/eventBus.js";
import cloudinary from "../../config/cloudinary.js";



export const createPost = async (req, res) => {

  try {
    const id = req.userId; // from auth middleware

    if (!id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { caption } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Image is required",
        success: false,
      });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        )
        .end(file.buffer);
    });

    const image = result.secure_url;

    const post = await Post.create({
      caption,
      image,
      author: id,
    });

    const user = await User.findById(id);

    user.posts.push(post._id);
    await user.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username profilePicture");

    eventBus.emit(EVENTS.POST_CREATED, {
      authorId: id,
      post: populatedPost,
      followers: user.followers
        ? user.followers.map((f) => f.toString())
        : [],
    });

    return res.status(201).json({
      message: "Post created successfully",
      success: true,
      post: populatedPost,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};