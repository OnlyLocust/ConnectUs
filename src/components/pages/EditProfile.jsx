"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setAuth } from "@/store/authSlice";
import GenderInput from "../common/editProfilePage/GenderInput";
import BioInput from "../common/editProfilePage/BioInput";
import ProfileInput from "../common/editProfilePage/ProfileInput";
import UserInputName from "../common/editProfilePage/UserInputName";
import SubmitButton from "../common/editProfilePage/SubmitButton";
import ShowAvatar from "../common/ShowAvatar";
import { API_URL } from "@/constants/constant";

const EditProfile = () => {
  const router = useRouter();
  const userId = useSelector((state) => state.auth.user._id)

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    username: user?.username,
    gender: user?.gender || 'Other',
    bio: user?.bio,
    profilePicture: user?.profilePicture,
  });

  const [previewImage, setPreviewImage] = useState(formData.profilePicture);

  useEffect(() => {
    router.prefetch(`/home/user/profile/${userId}`);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      let newForm = new FormData();
      newForm.append("username", formData.username);
      newForm.append("gender", formData.gender);
      newForm.append("bio", formData.bio);
      newForm.append("profilePicture", formData.profilePicture);

      const res = await axios.patch(`${API_URL}/user`, newForm, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        dispatch(setAuth(res.data.user));
        toast.success("Profile updated successfully");
        router.push(`/home/user/profile/${userId}`);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Profile Update failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="profilePicture" className="text-lg font-semibold">
            Profile Picture
          </Label>

          <ShowAvatar
            profilePicture={previewImage}
            username={formData.username}
            size={32}
          />

          <ProfileInput onChange={handleImageChange} />
        </div>

        <UserInputName value={formData.username} onChange={handleChange} />

        <GenderInput value={formData.gender} onChange={handleGenderChange} />

        <BioInput value={formData.bio} onChange={handleChange} />

        <SubmitButton isLoading={isLoading} userId={userId}/>
      </form>
    </div>
  );
};

export default EditProfile;
