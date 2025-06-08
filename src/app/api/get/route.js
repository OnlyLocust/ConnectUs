import { NextResponse } from "next/server";
import { auth } from "../middleware/authMiddleware";
import User from "@/models/user.model";

export const GET = async (req) => {
  try {
    // const id = auth(req);
    const id = req.headers.get('userId');

    const objectUserId = new mongoose.Types.ObjectId(id);

    const userWithCounts = await User.aggregate([
      { $match: { _id: objectUserId } },
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
          posts: {
            $map: {
              input: "$posts",
              as: "post",
              in: {
                _id: "$$post._id",
                image: "$$post.image",
                likeCount: { $size: "$$post.likes" },
                commentCount: { $size: "$$post.comments" },
              },
            },
          },
          bookmarks: {
            $map: {
              input: "$bookmarks",
              as: "post",
              in: {
                _id: "$$post._id",
                image: "$$post.image",
                likeCount: { $size: "$$post.likes" },
                commentCount: { $size: "$$post.comments" },
              },
            },
          },
        },
      },
    ]);

    const user = userWithCounts[0]; // because aggregate returns array

    return NextResponse.json({ user, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
