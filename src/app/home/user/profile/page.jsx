"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import PostsShow from "@/components/common/PostsShow";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loading from "@/components/pages/Loading";

const page = () => {
  const [selectedTab, setSelectedTab] = useState("Posts");

  const user = useSelector((state) => state.auth.user);

  return (
    
      user ? (
<div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-15 items-center mb-10 bg-white shadow-md rounded-lg p-6  justify-around">
        {/* Profile Picture */}
        <Avatar className="w-32 h-32 border-4 border-primary">
          <AvatarImage src={user.profilePicture} alt="Profile" />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4 justify-between">
            <h2 className="text-2xl font-semibold">{user?.username}</h2>
            <Link href="/home/edit/profile">
              <Button variant="outline" className="cursor-pointer">
                Edit Profile
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-8 text-sm mb-4">
              <span>
                <strong>{user?.posts.length}</strong> posts
              </span>
              <span>
                <Link href={`/home/user/followers/${user._id}`}>
                  <strong>{user.followers.length}</strong> followers
                </Link>
              </span>
              <span>
                <Link href={`/home/user/following/${user._id}`}>
                  <strong>{user.following.length}</strong> following
                </Link>
              </span>
            </div>
            <Button variant="secondary" className="cursor-pointer">
              View Posts
            </Button>
          </div>

          <div>
            <p className="font-semibold">{user?.username}</p>
            <p className="text-sm text-muted-foreground">{user?.bio}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-around mb-10 border-b border-gray-300 relative">
        {[
          ["Posts", user?.posts?.length],
          ["Bookmarks", user?.bookmarks?.length],
        ].map((tab) => (
          <button
            key={tab[0]}
            onClick={() => setSelectedTab(tab[0])}
            className={`relative px-4 py-2 text-base font-medium transition-all duration-300 ease-in-out 
      ${
        selectedTab === tab[0]
          ? "text-black font-bold"
          : "text-gray-500 hover:text-black"
      }`}
          >
            {tab[0]} {tab[1]}
            {/* Underline animation */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-all duration-300 ease-in-out 
          ${
            selectedTab === tab[0]
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          }`}
            />
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div
        key={selectedTab} // triggers re-animation on tab change
        className="transition-all duration-500 ease-in-out animate-fadeIn"
      >
        {selectedTab === "Posts" && <PostsShow posts={user?.posts} />}
        {selectedTab === "Bookmarks" && <PostsShow posts={user?.bookmarks} />}
      </div>
    </div>
      ) :(
        <Loading/>
      )
    
  );
};

export default page;

// 💬❤️
