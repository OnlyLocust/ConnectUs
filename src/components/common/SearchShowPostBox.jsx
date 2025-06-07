import Link from "next/link";
import React from "react";

const SearchShowPostBox = ({post}) => {
  return (
    <Link href={`/home/posts/${post._id}`} className="block">
    <div className="relative group" >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={post.image || "/placeholder-image.jpg"}
          alt={post.caption || "Post"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </div>

      {post.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white text-sm line-clamp-2">{post.caption}</p>
        </div>
      )}
    </div>
    </Link>
  );
};

export default SearchShowPostBox;
