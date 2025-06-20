import User from "@/models/user.model";
import { NextResponse } from "next/server";
import cloudinary, { getPublicIdFromUrl } from "@/utils/cloudinary";

export const GET = async (req) => {
  try {
    const id = req.headers.get('userId');
    const user = await User.findById(id).populate("posts bookmarks");
    return NextResponse.json({ user, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};

export const PATCH = async (req) => {
  try {
    const id = req.headers.get("userId");


    const form = await req.formData(); // ⬅️ this is the key

    const username = form.get("username");
    const gender = form.get("gender");
    const bio = form.get("bio");
    const file = form.get("profilePicture"); // this will be a Blob (File)

    // const { username, profilePicture, gender, bio } = await req.json();

    if (!username && !file && !gender && !bio) {
      return NextResponse.json(
        { error: "No fields to update", success: false },
        { status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    let changes = false;

    if (username && username !== user.username) {
      user.username = username;
      changes = true;
    }
    if (file && typeof file.arrayBuffer === "function") {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
          .end(buffer); // 🔥 Send the buffer here!
      });

      if (user.profilePicture) {
        const publicId = getPublicIdFromUrl(user.profilePicture);
        await cloudinary.uploader.destroy(publicId);        
      }

      user.profilePicture = result.secure_url;
      changes = true;
    }
    if (gender && user.gender !== gender) {
      user.gender = gender;
      changes = true;
    }
    if (bio && user.bio !== bio) {
      user.bio = bio;
      changes = true;
    }

    await user.save();

    if (changes) {
      return NextResponse.json(
        { user, message: "User Update successful", success: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { user, message: "User not need Update", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};
