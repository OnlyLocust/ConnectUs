import { auth } from "@/app/api/middleware/authMiddleware";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    try {
        const {id:userId} = await params;
        // const id = auth(req)
    const id = req.headers.get('userId');
        if(!id) {
            return NextResponse.json(({success: false, message: "Unauthorized"}), {status: 401});
        }
        if(!userId) {
            return NextResponse.json(({success: false, message: "User ID is required"}), {status: 400});
        }

        const userFollowing = await User.findById(userId).populate("following", "username profilePicture").select("following profilePicture username");

        if(!userFollowing) {
            return NextResponse.json(({success: false, message: "User not found"}), {status: 404});
        }
        return NextResponse.json({
            success: true,
            userData: {
                username: userFollowing.username,
                profilePicture: userFollowing.profilePicture
            },
            followData: userFollowing.following
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error"
        }, {status: 500});
    }
}