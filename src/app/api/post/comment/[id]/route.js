import Comment from "@/models/comment.model";
import Post from "@/models/post.model";
import { NextResponse } from "next/server";
import { createAndSendNotification } from "@/app/api/utils/notification";

export const PATCH = async (req, { params }) => {
    try {
        const id = req.headers.get('userId');

        const { text, optimisticId } = await req.json();
        if (!text || text.trim() === '') {
            return NextResponse.json({ message: 'Comment text is required', success: false }, { status: 400 });
        }

        const {id : postId} = await params;
        if (!id) {
            return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
        }

        if (!postId) {
            return NextResponse.json({ message: 'Post ID is required', success: false }, { status: 400 });
        }

        const comment = await Comment.create({
            text,
            author: id,
            post: postId
        });

       const post = await Post.findByIdAndUpdate(
          postId,
          { $push: { comments: comment._id } },
          { new: true }
       );

       const populatedComment = await Comment.findById(comment._id).populate("author", "username profilePicture");

       if (post) {
           await createAndSendNotification(id, post.author, "comment");
       }

       if (global.io) {
           global.io.to(`post:${postId}`).emit("post-comment", { postId, comment: populatedComment, optimisticId });
       }

       return NextResponse.json({ message: 'Comment added successfully', success: true, comment: populatedComment, optimisticId }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error.message, success: false }, { status: 500 });
    }
}