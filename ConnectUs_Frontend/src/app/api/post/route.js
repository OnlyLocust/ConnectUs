import Post from "@/models/post.model";
import { NextResponse } from "next/server";

const skipValue = 4;

export const GET = async (req) => {
  try {
    const id = req.headers.get("userId");

    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const before = searchParams.get("before");
    const limit = parseInt(searchParams.get("limit")) || 4;

    let query = {};
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    let queryExec = Post.find(query)
      .populate("author", "username profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "author", // populate comment author inside each comment
          select: "username profilePicture", // select needed fields
        },
      })
      .sort({ createdAt: -1 });

    if (!before) {
      const skip = parseInt(searchParams.get("skip")) || 0;
      queryExec = queryExec.skip(skip * skipValue);
    }

    const posts = await queryExec.limit(limit);


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
