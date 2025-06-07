import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const userId = req.headers.get("userId");
  try {
    const notifications = await User.findById(userId)
  .select("notifications") // only fetch notifications array
  .populate({
    path: "notifications.notification",
    populate: {
      path: "actor",
      select: "username", // only populate username of actor
    },
  });


  return NextResponse.json({notifications:notifications.notifications , success:true},{status:200})

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
