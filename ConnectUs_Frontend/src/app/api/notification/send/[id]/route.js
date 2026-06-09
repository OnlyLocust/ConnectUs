import Notification from "@/models/notification.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
  const userId = req.headers.get("userId");
  
  try {
      const { id: recvId } = await params;
      const {action} = await req.json()

      const notification = await Notification.create({
        actor:userId,
        action
      })

      if(!notification){
        throw new Error("Failed to create notification")
      }

      const user = await User.findByIdAndUpdate(recvId, {
      $push: {
        "notifications.notification": {
          $each: [notification._id], // the new notification _id
          $position: 0, // insert at the beginning
        },
      },
      $inc: {
        "notifications.notRead": 1,
      },
    });

    return NextResponse.json({message:"Notification added",success:true},{status:200})



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
