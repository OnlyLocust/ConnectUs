import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";
import User from "../../models/user.model.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existUser = await User.findOne({ email }).select("+password").lean();

    if (!existUser) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = generateToken(existUser._id);

    const userWithCounts = await User.aggregate([
      {
        $match: {
          _id: existUser._id,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "posts",
          foreignField: "_id",
          as: "posts",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "bookmarks",
          foreignField: "_id",
          as: "bookmarks",
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          profilePicture: 1,
          followers: 1,
          following: 1,
          notifications: 1,
          posts: 1,
          bookmarks: 1,
        },
      },
    ]);

    const user = userWithCounts[0];

    const notRead = user?.notifications?.notRead || 0;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:  process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000 * 24, // milliseconds
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user,
      notRead,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};