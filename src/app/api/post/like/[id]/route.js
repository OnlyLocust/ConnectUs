import Post from "@/models/post.model";
import { NextResponse } from "next/server";

export const PATCH = async (req, { params }) => {
    try {
        const {id : postId} = await params;
    const id = req.headers.get('userId');
        if (!id) {
            return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
        }
        if (!postId) {
            return NextResponse.json({ message: 'Post ID is required', success: false }, { status: 400 });
        }

        const { like } = await req.json();
        const post = await Post.findById(postId);

        if(like == 'like'){
            post.likes.push(id);
            await post.save();
            return NextResponse.json({ message: 'Like successful', success: true }, { status: 200 });
        }
        else{
            post.likes = post.likes.filter(like => like.toString() != id);
            await post.save();
            return NextResponse.json({ message: 'Unlike successful', success: true }, { status: 200 });
        }

    } catch (error) {
        return NextResponse.json({ message: error.message, success: false }, { status: 500 });
        
    }
}