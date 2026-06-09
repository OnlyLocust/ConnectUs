"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import PostCard from "../common/PostCard";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, addPosts } from "@/store/postSlice";
import axios from "axios";
import Loading from "../common/Loading";
import NoPosts from "../common/NoPost";
import { API_URL } from "@/constants/constant";

const Main = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchPosts = useCallback(async (isInitial = false) => {
    if (loading) return;
    if (!isInitial && !hasMore) return;

    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const before = (!isInitial && posts.length > 0) ? posts[posts.length - 1].createdAt : "";
      const url = before
        ? `${API_URL}/post?before=${encodeURIComponent(before)}&limit=4`
        : `${API_URL}/post?limit=4`;

      const res = await axios.get(url, {
        withCredentials: true,
        signal: controller.signal,
      });

      if (res.data.success) {
        const newPosts = res.data.posts || [];

        if (newPosts.length === 0) {
          if (!isInitial) {
            setHasMore(false);
          } else {
            dispatch(setPosts([]));
          }
          return;
        }

        if (isInitial || !before) {
          dispatch(setPosts(newPosts));
          setHasMore(true);
        } else {
          dispatch(addPosts(newPosts));
        }

        if (newPosts.length < 4) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        throw new Error(res.data.message || "Failed to fetch posts");
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch posts"
      );
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [posts, loading, hasMore, dispatch]);

  useEffect(() => {
    fetchPosts(true);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchPostsRef = useRef(fetchPosts);
  useEffect(() => {
    fetchPostsRef.current = fetchPosts;
  }, [fetchPosts]);

  useEffect(() => {
    if (initialLoad || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPostsRef.current();
        }
      },
      { threshold: 0.1 }
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
  }, [initialLoad, hasMore]);

  return (
    <main className="flex-1 max-w-[600px] mx-auto px-4 py-6 w-full min-h-0 max-h-[calc(100dvh-1rem)] overflow-y-auto hide-scrollbar">
      <div className="flex flex-col gap-6">
        {loading && initialLoad ? (
          <Loading />
        ) : posts.length > 0 ? (
          <div className="animate-fadeIn">
            {posts.map((post, i) => (
              <PostCard key={`${post._id}-${i}`} post={post} type="all" />
            ))}
          </div>
        ) : (
          <NoPosts />
        )}
      </div>

      <div
        ref={observerRef}
        className="h-10 mt-4 flex items-center justify-center"
      >
        {loading && !initialLoad && (
          <span className="text-muted-foreground">Loading more posts...</span>
        )}
        {!hasMore && posts.length > 0 && (
          <span className="text-muted-foreground">No more posts to show</span>
        )}
      </div>
    </main>
  );
};

export default Main;
