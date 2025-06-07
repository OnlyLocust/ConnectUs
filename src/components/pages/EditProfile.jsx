"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/constants/constant";
import { setAuth } from "@/store/authSlice";
import { Loader2 } from "lucide-react";

const EditProfile = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    username: user?.username,
    gender: user?.gender,
    bio: user?.bio,
    profilePicture: user?.profilePicture,
  });

  const [previewImage, setPreviewImage] = useState(formData.profilePicture);

    useEffect(() => {
      router.prefetch('/home/profile');
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
      // You would typically upload the image here and get the URL
      setFormData((prev) => ({
        ...prev,
        profilePicture:file,
        // profilePicture: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission (API call, etc.)

    try {
      setIsLoading(true);
      let newForm = new FormData();
      newForm.append('username', formData.username);
      newForm.append('gender', formData.gender);
      newForm.append('bio', formData.bio);
      newForm.append('profilePicture', formData.profilePicture);

        const res = await axios.patch(`${API_URL}/user`, newForm, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data.success) {
          dispatch(setAuth(res.data.user));
          toast.success("Profile updated successfully");
          router.push("/home/profile");
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
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="profilePicture" className="text-lg font-semibold">
            Profile Picture
          </Label>

          <Avatar className="w-32 h-32 border-4 border-primary">
            <AvatarImage src={previewImage} alt="Profile" />
            <AvatarFallback>
              {formData.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <Label
            htmlFor="profilePicture"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
          >
            Change Photo
          </Label>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={handleGenderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell others about yourself"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
