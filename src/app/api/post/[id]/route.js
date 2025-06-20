import User from "@/models/user.model";
import Post from "@/models/post.model";
import { NextResponse } from "next/server";
import Comment from "@/models/comment.model";
import cloudinary, { getPublicIdFromUrl } from "@/utils/cloudinary";



export const DELETE = async (req, { params }) => {
  try {
    const { id: postId } = await params;
    const id = req.headers.get('userId');
    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required", success: false },
        { status: 400 }
      );
    }

    const user = await User.findById(id);
    const isHisPost = user.posts.includes(postId);

    if (!isHisPost) {
      return NextResponse.json(
        { message: "You can only delete your own posts", success: false },
        { status: 403 }
      );
    }

    //remove post from user 
    user.posts = user.posts.filter((post) => post != postId);

    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return NextResponse.json(
        { message: "Post not found", success: false },
        { status: 404 }
      );
    }

    // remove image from cloudinary

    const publicId = getPublicIdFromUrl(deletedPost.image);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
    else throw new Error("Failed to delete image")
  
    // to be done in future

    // delete all comment reletaed to this post
    await Comment.deleteMany({ _id: { $in: deletedPost.comments } });

    // delete all book marks 
    await User.updateMany(
      { bookmarks: postId },
      { $pull: { bookmarks: postId } }
    );

    await user.save();
    return NextResponse.json(
      { message: "Post deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};

export const PATCH = async (req, { params }) => {
  try {
    const { id: postId } = await params;
    const id = req.headers.get('userId');
    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required", success: false },
        { status: 400 }
      );
    }

    const { caption, image } = await req.json();
    if (!image && !caption) {
      return NextResponse.json(
        {
          message: "At least one field (caption or image) is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found", success: false },
        { status: 404 }
      );
    }

    const isHisPost = post.author.toString() === id;
    if (!isHisPost) {
      return NextResponse.json(
        { message: "You can only edit your own posts", success: false },
        { status: 403 }
      );
    }

    if (caption) post.caption = caption;
    if (image) post.image = image;
    await post.save();

    return NextResponse.json(
      { message: "Post updated successfully", success: true, post },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};

export const GET = async (req, { params }) => {
  try {
    const { id: postId } = await params;
    const id = req.headers.get('userId');
    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required", success: false },
        { status: 400 }
      );
    }


    const post = await Post.findById(postId)
      .populate("author", "username profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "author", // populate comment author inside each comment
          select: "username profilePicture", // select needed fields
        },
      })

    if (!post) {
      return NextResponse.json(
        { message: "Post not found", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Post fetched successfully", success: true, post },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
