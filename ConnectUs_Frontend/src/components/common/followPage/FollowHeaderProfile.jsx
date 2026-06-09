import React from "react";
import ShowAvatar from "../ShowAvatar";

const FollowHeaderProfile = ({profilePicture, username, userId, id, followType}) => {
  return (
      <div className="flex gap-2 sm:gap-4 items-center justify-center">
        <ShowAvatar profilePicture={profilePicture} username={username} size={10}/>
        <h1 className="text-lg sm:text-2xl font-semibold">
          {userId == id ? "Your" : `${username}'s`}{" "}
          {followType == "followers" ? "followers" : "following"}
        </h1>
      </div>

  );
};

export default FollowHeaderProfile;
