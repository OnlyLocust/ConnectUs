import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const PATCH = async (req) => {
  const userId = req.headers.get("userId");
  try {
    await User.findByIdAndUpdate(userId, {
      $set: {
        "notifications.notRead": 0,
      },
    });

    if (global.io) {
      global.io.to(userId).emit("notification-reset");
    }

    return NextResponse.json({success:true},{status:200})
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
};
