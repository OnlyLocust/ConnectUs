import User from "../../models/user.model.js";



const getFollowData = async (
  req,
  res,
  field
) => {
  const { userId } = req.params;
  
  const user = await User.findById(userId)
    .select(`${field} username profilePicture`)
    .populate(
      field,
      "username profilePicture"
    )
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    userData: {
      username: user.username,
      profilePicture: user.profilePicture,
    },
    followData: user[field],
  });
};

export const getFollowers = (req, res) =>
  getFollowData(req, res, "followers");

export const getFollowing = (req, res) =>
  getFollowData(req, res, "following");
