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
    dispatch(logout());
    disconnectSocket();

    router.replace("/");

    toast.success("Logout successful");

    axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true,
    }).catch((err) => {
      console.error("Logout API failed:", err);
    });

  } catch (error) {
    toast.error("Logout failed");
  }
};

  return (
    <div className="px-6">
      <button
        type="button"
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
