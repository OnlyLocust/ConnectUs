import Post from "../../models/post.model.js";



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