import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    try {
        const {id:userId} = await params;
    const id = req.headers.get('userId');
        if(!id) {
            return NextResponse.json(({success: false, message: "Unauthorized"}), {status: 401});
        }
        if(!userId) {
            return NextResponse.json(({success: false, message: "User ID is required"}), {status: 400});
        }

        const userFollowers = await User.findById(userId).populate("followers", "username profilePicture").select("followers profilePicture username");

        if(!userFollowers) {
            return NextResponse.json(({success: false, message: "User not found"}), {status: 404});
        }
        
        return NextResponse.json({
            success: true,
            userData: {
                username: userFollowers.username,
                profilePicture: userFollowers.profilePicture
            },
            followData: userFollowers.followers
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error"
        }, {status: 500});
    }
}