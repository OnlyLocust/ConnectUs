import Post from "@/models/post.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { auth } from "../../middleware/authMiddleware";
import cloudinary from "@/utils/cloudinary";

export const POST = async (req) => {
  try {
    // const id = auth(req);
    const id = req.headers.get('userId');
    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    // const {caption, image} = await req.json();

    const form = await req.formData();
    const file = form.get("image");
    const caption = form.get("caption");

    if (!file) {
      return NextResponse.json(
        { message: "Image is required", success: false },
        { status: 400 }
      );
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

      const image = result.secure_url;
      const post = await Post.create({
        caption,
        image,
        author: id,
      });

      const user = await User.findById(id);

      user.posts.push(post._id);
      await user.save();

      return NextResponse.json(
        { message: "Post created successfully", success: true, post },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid image file", success: false },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
