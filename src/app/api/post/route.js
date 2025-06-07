import Post from "@/models/post.model";
import { auth } from "../middleware/authMiddleware";
import { NextResponse } from "next/server";

const skipValue = 4

export const GET = async (req) => {
  try {
    // const id = auth(req);
    const id = req.headers.get("userId");

    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip")) || 0;
    const limit = parseInt(searchParams.get("limit")) || 4;

    const posts = await Post.find()
      .populate("author", "username profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "author", // populate comment author inside each comment
          select: "username profilePicture", // select needed fields
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip*skipValue)
      .limit(limit);

      console.log(skip);
      

      

    return NextResponse.json(
      { message: "Posts fetched successfully", success: true, posts },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
