import { NextResponse } from "next/server"
import { auth } from "../../middleware/authMiddleware"
import User from "@/models/user.model"

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

    const users = await User.find().select("username profilePicture ")

        return NextResponse.json({
            success: true,
            users
        }, { status: 200 })
        

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal server error"
        }, { status: 500 })
    }
}








