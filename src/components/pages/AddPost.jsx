"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setPost } from "@/store/authSlice";
import ProfileHeader from "../common/addPostPage/ProfileHeader";
import ImageInput from "../common/addPostPage/ImageInput";
import SubmitButton from "../common/addPostPage/SubmitButton";
import CaptionInput from "../common/addPostPage/CaptionInput";
import dotenv from 'dotenv'
dotenv.config()
const API_URL = process.env.API_URL

export default function AddPost() {

const dispatch = useDispatch();
  const router = useRouter();
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


  const clearImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        withCredentials: true,
      });

      if(res.data.success === false) {
        throw new Error(res.data.message || "Failed to create post");
      }


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
          <ProfileHeader isLoading={isLoading} image={image} submitPost={submitPost}/>

          <ImageInput image={image} previewUrl={previewUrl} clearImage={clearImage} fileInputRef={fileInputRef} onImageChange={onImageChange}/>

          <div className="space-y-4">

            <CaptionInput caption={caption} showEmojiPicker={showEmojiPicker} captionRef={captionRef} setCaption={setCaption} setShowEmojiPicker={setShowEmojiPicker}/>

            <SubmitButton disabled={isLoading || !image} isLoading={isLoading} submitPost={submitPost}/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
