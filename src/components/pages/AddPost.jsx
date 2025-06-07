"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2Icon,
  ImageIcon,
  XIcon,
  MapPin,
  Smile,
  Users,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import axios from "axios";
import { API_URL } from "@/constants/constant";
import { useRouter } from "next/navigation";
import { setPost } from "@/store/authSlice";

export default function AddPost() {

const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const captionRef = useRef(null);

  useEffect(() => {
    router.prefetch('/home');
  }, []);


  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (JPEG, PNG, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Clear image preview
  const clearImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle emoji selection
  const onEmojiClick = (emojiData) => {
    const cursorPosition = captionRef.current?.selectionStart || 0;
    const textBefore = caption.substring(0, cursorPosition);
    const textAfter = caption.substring(cursorPosition);
    setCaption(textBefore + emojiData.emoji + textAfter);
    setShowEmojiPicker(false);
  };
  const submitPost = async () => {
    if (!image) {
      toast.error("Please select an image");
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      formData.append("caption", caption);

      const res = await axios.post(`${API_URL}/post/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Include cookies for authentication
      });

      if(res.data.success === false) {
        throw new Error(res.data.message || "Failed to create post");
      }

      // Simulate API call
      dispatch(setPost({postId: res.data.post._id, image: res.data.post.image}));
      await new Promise((r) => setTimeout(r, 2000));

      toast.success("Post created successfully!");
      setCaption("");
      clearImage();
      router.push("/home"); 
    } catch (error) {
      toast.error( error.response?.data?.message || error.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <Card className="w-full max-w-2xl rounded-lg shadow-sm bg-white">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-pink-500">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>
                  {user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-xs text-gray-500">Post to your profile</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-blue-500 hover:text-blue-700"
              onClick={submitPost}
              disabled={isLoading || !image}
            >
              {isLoading ? (
                <Loader2Icon className="animate-spin h-5 w-5" />
              ) : (
                "Share"
              )}
            </Button>
          </div>

          {/* Image preview or upload button */}
          <div className="border rounded-lg border-dashed border-gray-300 relative cursor-pointer hover:border-gray-400 transition">
            {image ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-[500px] object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 cursor-pointer"
                  aria-label="Remove image"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center h-64 cursor-pointer text-gray-400"
              >
                <ImageIcon className="w-12 h-12 mb-3" />
                <span className="text-lg">
                  Drag photos and videos here or click to browse
                </span>
                <p className="text-sm text-gray-400 mt-2">
                  JPEG, PNG up to 5MB
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={onImageChange}
                  ref={fileInputRef}
                />
              </label>
            )}
          </div>

          {/* Post details section */}
          <div className="space-y-4">
            {/* Caption input with emoji picker */}
            <div className="relative">
              <Textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                className="resize-none pr-10"
                ref={captionRef}
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-2 bottom-2 text-gray-400 hover:text-gray-600"
              >
                <Smile className="h-5 w-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute right-0 bottom-12 z-10">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={300}
                    height={350}
                  />
                </div>
              )}
            </div>

            {/* Additional features */}
            <div className="space-y-3">

              <Button
                className="w-full cursor-pointer"
                disabled={isLoading || !image}
                 onClick={submitPost}
              >
                {isLoading ? (
                <Loader2Icon className="animate-spin h-5 w-5" />
              ) : (
                "Share"
              )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
