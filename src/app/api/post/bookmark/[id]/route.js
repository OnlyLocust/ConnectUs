import { auth } from "@/app/api/middleware/authMiddleware";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const PATCH = async (req, { params }) => {
    try {
        // const id = auth(req);
    const id = req.headers.get('userId');
        if (!id) {
            return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
        }
        const {id : postId} = await params;
        if (!postId) {
            return NextResponse.json({ message: 'Post ID is required', success: false }, { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ message: 'User not found', success: false }, { status: 404 });
        }

        const isAlreadyBookmarked = user.bookmarks.includes(postId);
        if (isAlreadyBookmarked) {
            user.bookmarks = user.bookmarks.filter(bookmark => bookmark.toString() != postId);
            await user.save();
            return NextResponse.json({ message: 'Unbookmark successful', success: true }, { status: 200 });
        }
        else{
            user.bookmarks.push(postId);
            await user.save();
            return NextResponse.json({ message: 'Bookmark successful', success: true }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: error.message, success: false }, { status: 500 });
        
    }
}