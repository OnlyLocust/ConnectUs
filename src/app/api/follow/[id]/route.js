import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const PATCH = async (req, { params }) => {
  try {
    const {id : userId} = await params;
    const id = req.headers.get('userId');


    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 }
      );
    }

    if (userId === id) {
      return NextResponse.json(
        { message: "You cannot follow yourself", success: false },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const currentUser = await User.findById(id);
    if (!currentUser) {
      return NextResponse.json(
        { message: "Current user not found", success: false },
        { status: 404 }
      );
    }
    
    const isFollowing = currentUser.following.includes(userId);



    if (isFollowing) {
      // i will unfollow
      currentUser.following = currentUser.following.filter(
        (followingId) => followingId != userId
      );
      user.followers = user.followers.filter((followerId) => followerId != id);
      

      await currentUser.save();
      await user.save();

      return NextResponse.json(
        { message: "Unfollowed successfully", success: true, follow: false },
        { status: 200 }
      );
    } else {
      // i will follow
      currentUser.following.push(userId);
      user.followers.push(id);

      await currentUser.save();
      await user.save();
      return NextResponse.json(
        { message: "Followed successfully", success: true, follow: true },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
