import User from "../../models/user.model.js"



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