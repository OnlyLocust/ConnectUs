"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/constants/constant";
import { setSearchPosts, setSearchUsers } from "@/store/searchSlice";
import SearchShowPostBox from "../common/searchPage/SearchShowPostBox";
import SearchTabs from "../common/searchPage/SearchTabs";
import SearchForm from "../common/searchPage/SearchForm";
import SearchLoading from "../common/searchPage/SearchLoading";
import NoSearch from "../common/searchPage/NoSearch";
import SearchShowFollowBox from "../common/searchPage/SearchShowFollowBox";


const searchSlicing = 7

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
        <SearchForm value={searchQuery} onChange={handleSearch} setSearchQuery={setSearchQuery} />

        {/* Tabs */}
        <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Results */}
      <div className="mt-4 space-y-4">
        {isLoading ? (
          <SearchLoading/>
        ) : searchItem.length > 0 ? (
          <div className="space-y-3">
            {activeTab === "users" ? (
              searchItem.slice(0, searchSlicing).map((item, i) => (
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
                {searchItem.slice(0, searchSlicing).map((item) => (
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
          <NoSearch/>
        ) : null}
      </div>
    </div>
  );
}
