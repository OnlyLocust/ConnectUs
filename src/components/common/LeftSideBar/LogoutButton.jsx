import { disconnectSocket } from "@/lib/socket";
import { logout } from "@/store/authSlice";
import axios from "axios";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { API_URL } from "@/constants/constant";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        router.push("/");
        toast.success("Logout successful");
      } else {
        throw new Error(res.data.message || "Logout failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Logout failed"
      );
    } finally {
      disconnectSocket();
      await new Promise((r) => setTimeout(r, 5000));
      dispatch(logout());
    }
  };

  return (
    <div className="px-6">
      <button
        href="/"
        onClick={logoutHandler}
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-red-50 transition-colors duration-200 w-full cursor-pointer"
      >
        <LogOut size={22} className="text-red-500" />
        <span className="font-medium text-red-500">Log Out</span>
      </button>
    </div>
  );
};

export default LogoutButton;
