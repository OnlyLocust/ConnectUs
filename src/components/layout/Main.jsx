"use client";

import React, { useEffect, useRef, useState } from "react";
import PostCard from "../common/PostCard";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, addPosts } from "@/store/postSlice";
import axios from "axios";
import Loading from "../common/Loading";
import NoPosts from "../common/NoPost";
import dotenv from 'dotenv'
dotenv.config()
const API_URL = process.env.API_URL

const Main = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const observerRef = useRef(null);
  const initialLoad = useRef(true);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/post?skip=${skip}&limit=4`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const newPosts = res.data.posts || [];

        if (newPosts.length === 0) {
          setHasMore(false);
          return;
        }

        if (skip === 0) {
          dispatch(setPosts(newPosts));
        } else {
          dispatch(addPosts(newPosts));
        }

        setSkip(skip + 1);

        if (newPosts.length < 4) {
          setHasMore(false);
        }
      } else {
        throw new Error(res.data.message || "Failed to fetch posts");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch posts"
      );
    } finally {
      setLoading(false);
      initialLoad.current = false;
    }
  };

  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    fetchPosts();
  }, []);

  useEffect(() => {
    if (initialLoad.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    const currentObserverRef = observerRef.current;

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [loading, hasMore, skip]);

  return (
    <main className="flex-1 max-w-[600px] mx-auto px-4 py-6 h-screen overflow-y-auto hide-scrollbar">


      <div className="flex flex-col gap-6">
        {!loading ? (
          posts.length > 0 ? (
            <div className="animate-fadeIn">
            {posts.map((post, i) => (
            <PostCard key={`${post._id}-${i}`} post={post} type="all" />
          ))}
          </div>
          ) : (
            <NoPosts/>
          )
        ) : (
          <Loading />
        )}
      </div>


      <div
        ref={observerRef}
        className="h-10 mt-4 flex items-center justify-center"
      >
        {loading && (
          <span className="text-gray-500">Loading more posts...</span>
        )}
        {!hasMore && posts.length > 0 && (
          <span className="text-gray-400">No more posts to show</span>
        )}
      </div>
    </main>
  );
};

export default Main;
