import User from "../models/user.model.js";
import { eventBus, EVENTS } from "../utils/eventBus.js";

export const toggleFollow = async (req, res) => {
  try {

    const userId = req.params.id;      // profile being followed
    const currentUserId = req.userId; // logged in user

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (userId === currentUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentUser = await User.findById(
      currentUserId
    );

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    const isFollowing =
      currentUser.following.some(
        id => id.toString() === userId
      );

    if (isFollowing) {

      currentUser.following =
        currentUser.following.filter(
          id => id.toString() !== userId
        );

      user.followers =
        user.followers.filter(
          id => id.toString() !== currentUserId
        );

      await currentUser.save();
      await user.save();

      eventBus.emit(EVENTS.FOLLOW_CREATED, {
        followerId: currentUserId,
        followingId: userId,
        follow: false,
      });

      return res.status(200).json({
        success: true,
        message: "Unfollowed successfully",
        follow: false,
      });

    } else {

      currentUser.following.push(userId);
      user.followers.push(currentUserId);

      await currentUser.save();
      await user.save();

      eventBus.emit(EVENTS.FOLLOW_CREATED, {
        followerId: currentUserId,
        followingId: userId,
        follow: true,
      });

      return res.status(200).json({
        success: true,
        message: "Followed successfully",
        follow: true,
      });
    }

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};