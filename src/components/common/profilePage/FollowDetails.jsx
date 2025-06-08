import Link from "next/link";
import React from "react";

const FollowDetails = ({userId,postLength,followerCount,followingCount}) => {
  return (
    <div className="flex gap-8 text-sm mb-4">
      <span>
        <strong>{postLength || '0'}</strong> posts
      </span>
      <span>
        <Link href={`/home/user/followers/${userId}`}>
          <strong>{followerCount || '0'}</strong> followers
        </Link>
      </span>
      <span>
        <Link href={`/home/user/following/${userId}`}>
          <strong>{followingCount || '0'}</strong> following
        </Link>
      </span>
    </div>
  );
};

export default FollowDetails;
