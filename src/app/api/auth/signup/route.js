import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";

export const POST = async (req) => {
  try {

    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    const existUser = await User.find({ $or: [{ username }, { email }] });

    if (existUser.length > 0) {
      return NextResponse.json(
        { message: "Username or email already exists", success: false },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return NextResponse.json(
        { message: "Error hashing password", success: false },
        { status: 500 }
      );
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    const user = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      posts: newUser.posts,
      followers: newUser.followers,
      following: newUser.following,
      bio: newUser.bio,
      gender: newUser.gender,
      bookmarks: newUser.bookmarks,
      notifications:newUser.notifications
    };

    const res = NextResponse.json(
      { message: "User created successfully", success: true, user },
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};
