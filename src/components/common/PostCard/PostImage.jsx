import React from "react";

const PostImage = ({image = '#', caption="Post image"}) => {
  return (
    <div className="w-full bg-gray-50 overflow-hidden rounded-md">
      <img
        src={image }
        alt={caption }
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default PostImage;
