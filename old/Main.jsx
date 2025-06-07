"use client";

import React, { useEffect, useRef } from "react";
import PostCard from "../common/PostCard";
import { API_URL } from "@/constants/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/store/postSlice";
import axios from "axios";
import Loading from "../pages/Loading";

const Main = () => {



  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  useEffect(() => {
    const getPosts = async () => {

      
      const skip = localStorage.getItem('skip')
      if(!skip){
        localStorage.setItem('skip', 0)
      }
      

      try {
        const res = await axios.get(`${API_URL}/post/?skip=${skip}`, {
          withCredentials: true,
        });
        const allPosts = res.data.posts
        
        if (res.data.success) {
          dispatch(setPosts(allPosts));
        } else {
          throw new Error(res.data.message || "Failed to fetch posts");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch posts"
        );
      }
    };
    getPosts();
  }, []);

  

  return (
    <main className="flex-1 max-w-[600px] mx-auto px-4 py-6 h-screen overflow-y-auto hide-scrollbar">
      {/* Stories */}
      {/* dont delete this , it will use in edit posts */}
      {/* <div className="flex gap-4 overflow-x-auto pb-4 mb-4 border-b">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Avatar className="border-2 border-pink-500">
              <AvatarImage src={`https://i.pravatar.cc/150?img=${i}`} />
              <AvatarFallback>U{i}</AvatarFallback>
            </Avatar>
            <span className="text-xs">user{i}</span>
          </div>
        ))}
      </div> */}

      {/* Posts */}
      <div className="flex flex-col gap-6">
        {
          posts.length > 0 ? posts?.map((post, i) => (
          <PostCard key={i} post={post} type='all'/> 
        )
      )
      : <Loading/>
        }
      </div>

    </main>
  );
};

export default Main;