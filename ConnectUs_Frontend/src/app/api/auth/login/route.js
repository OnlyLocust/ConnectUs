import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";

export const POST = async (req) => {
  try {

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    // Get user with password for login check
    const existUser = await User.findOne({ email }).select("+password");

    if (!existUser) {
      return NextResponse.json(
        { message: "User does not exist", success: false },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existUser.password
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 400 }
      );
    }

    // Generate token
    const token = generateToken(existUser._id);

    // Fetch user data with only needed fields using aggregation
    const userWithCounts = await User.aggregate([
      { $match: { _id: existUser._id } },
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
          followers:1,
          following:1,
          notifications:1,
          posts:1,
          bookmarks: 1
        },
      },
    ]);

    const user = userWithCounts[0]; // because aggregate returns array
    const notRead = user.notifications.notRead
    
    const res = NextResponse.json(
      { message: "Login successful", success: true, user , notRead},
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, 
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
