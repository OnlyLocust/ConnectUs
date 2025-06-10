import React from "react";
import { Card, CardContent } from "../ui/card";
import { Heart } from "lucide-react";
import { FaRegComment } from "react-icons/fa";
import Link from "next/link";

const PostsShow = ({ posts }) => {

  return (
    <div className="grid grid-cols-3 gap-4">
      {posts?.map((post, i) => (
        <Card key={i} className="overflow-hidden relative group cursor-pointer" >
          <Link href={`/home/posts/${post._id}`}>
          <CardContent className="p-0">
            <img
              src={post.image}
              alt={`Post ${i}`}
              className="w-full h-[300px] object-cover transition-all duration-300 group-hover:brightness-75"
            />


            <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-100 text-white font-semibold text-lg">
              <div className="flex items-center gap-1 text-2xl font-bold">
                <Heart /> { post.likeCount}
              </div>
              <div className="flex items-center gap-1 text-2xl font-bold ">
                <FaRegComment /> {post.commentCount}
              </div>
            </div>
          </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default PostsShow;
