import { NextResponse } from "next/server"
import { auth } from "../../middleware/authMiddleware"
import Post from "@/models/post.model"

export const GET = async (req) => {
    try {
        // const id = auth(req)
    const id = req.headers.get('userId');
        if(!id) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access"
            }, { status: 401 })
        }

        const posts = await Post.find().select("caption image")

        return NextResponse.json({
            success: true,
            posts
        }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal server error"
        }, { status: 500 })
    }
}