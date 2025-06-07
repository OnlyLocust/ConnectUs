import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { auth } from "../../middleware/authMiddleware";
import mongoose from "mongoose";


export const GET = async (req,{params}) => {
    try {
        // const id = auth(req)
    const id = req.headers.get('userId');
        const {id : userId} = await params;      

        
        // const user = await User.findById(userId)
        const objectUserId = new mongoose.Types.ObjectId(userId);

           const userWithCounts = await User.aggregate([
              { $match: { _id: objectUserId } },
              {
                $lookup: {
                  from: "posts",
                  localField: "posts",
                  foreignField: "_id",
                  as: "posts",
                },
              },
              {
                $lookup: {
                  from: "posts",
                  localField: "bookmarks",
                  foreignField: "_id",
                  as: "bookmarks",
                },
              },
              {
                $project: {
                  _id: 1,
                  username: 1,
                  profilePicture: 1,
                  followerCount: { $size: { $ifNull: ["$followers", []] } },
                  followingCount: { $size: { $ifNull: ["$following", []] } },
                  posts: {
                    $map: {
                      input: "$posts",
                      as: "post",
                      in: {
                        _id: "$$post._id",
                        image: "$$post.image",
                        likeCount: { $size: "$$post.likes" },
                        commentCount: { $size: "$$post.comments" },
                      },
                    },
                  },
                  bookmarks: {
                    $map: {
                      input: "$bookmarks",
                      as: "post",
                      in: {
                        _id: "$$post._id",
                        image: "$$post.image",
                        likeCount: { $size: "$$post.likes" },
                        commentCount: { $size: "$$post.comments" },
                      },
                    },
                  },
                },
              },
            ]);
        
            const user = userWithCounts[0]; // because aggregate returns array

        if(!user){
            return NextResponse.json({message:'User not found', success:false}, {status:404})
        }

        return NextResponse.json({user, success:true}, {status:200})
        
    } catch (error) {
        return NextResponse.json({message:error.message, success:false}, {status:500})    
        
    }
}