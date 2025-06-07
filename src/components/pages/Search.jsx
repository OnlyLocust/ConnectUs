"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchIcon, XIcon, UsersIcon, ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/constants/constant";
import { setSearchPosts, setSearchUsers } from "@/store/searchSlice";
import SearchShowFollowBox from "../common/SearchShowFollowBox";
import SearchShowPostBox from "../common/SearchShowPostBox";

export default function SearchPage() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  const users = useSelector((state) => state.search.users);
  const posts = useSelector((state) => state.search.posts);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Filtered search results
  const searchItem = useMemo(() => {
    if (activeTab === "users") {
      if (!debouncedQuery.trim()) return users;
      return users.filter((user) =>
        user.username.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    } else {
      if (!debouncedQuery.trim()) return posts;
      return posts.filter((post) =>
        post.caption.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
  }, [activeTab, users, posts, debouncedQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let controller = new AbortController();
    const fetchSearchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "users" && users.length === 0) {
          const res = await axios.get(`${API_URL}/getall/users`, {
            withCredentials: true,
            signal: controller.signal,
          });
          if (res.data.success) {
            dispatch(setSearchUsers(res.data.users));
          } else {
            throw new Error(res.data.message || "Failed to fetch users");
          }
        } else if (activeTab === "posts" && posts.length === 0) {
          const res = await axios.get(`${API_URL}/getall/posts`, {
            withCredentials: true,
            signal: controller.signal,
          });
          if (res.data.success) {
            dispatch(setSearchPosts(res.data.posts));
          } else {
            throw new Error(res.data.message || "Failed to fetch posts");
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        const errorMessage =
          error.response?.data?.message || error.message || "Fetch failed";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchData();
    return () => controller.abort();
  }, [activeTab]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="sticky top-0 bg-background z-10 pb-4">
        <form className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users or posts..."
              className="pl-10 pr-10 py-6 rounded-xl text-base"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>

        {/* Tabs */}
        <div className="flex space-x-2 mt-4">
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
            className="rounded-full"
          >
            <UsersIcon className="h-4 w-4 mr-2" /> Users
          </Button>
          <Button
            variant={activeTab === "posts" ? "default" : "outline"}
            onClick={() => setActiveTab("posts")}
            className="rounded-full"
          >
            <ImageIcon className="h-4 w-4 mr-2" /> Posts
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="mt-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : searchItem.length > 0 ? (
          <div className="space-y-3">
            {activeTab === "users" ? (
              searchItem.slice(0, 20).map((item, i) => (
                <Card
                  key={i}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-0">
                    <SearchShowFollowBox user={item} />
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchItem.slice(0, 20).map((item) => (
                  <Card
                    key={item._id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border hover:border-gray-200 m-1"
                  >
                    <CardContent className="p-0">
                      <SearchShowPostBox post={item} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : debouncedQuery && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <SearchIcon className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No results found
            </h3>
            <p className="text-gray-500 mt-1">
              Try different keywords or check your spelling
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
