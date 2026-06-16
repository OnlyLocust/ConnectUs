import User from "../../models/user.model.js";
import cloudinary from "../../config/cloudinary.js";
import { getPublicIdFromUrl } from "../../utils/cloudinary.js";


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
