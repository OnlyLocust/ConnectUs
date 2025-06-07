"use client";
import React, { memo, useEffect } from "react";

import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import axios from "axios";
import { API_URL } from "@/constants/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { logout } from "@/store/authSlice";
import Link from "next/link";
import { disconnectSocket, initiateSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";

const LeftSideBar = () => {
  const user = useSelector((state) => state.auth.user);
  const notRead = useSelector((state) => state.auth.notRead);
  const dispatch = useDispatch();
  const router = useRouter();  

  const sideItems = useMemo(
    () => [
      {
        icon: <Home size={22} />,
        text: "Home",
        path: "/home",
      },
      {
        icon: <Search size={22} />,
        text: "Search",
        path: "/home/search",
      },
      {
        icon: <TrendingUp size={22} />,
        text: "Explore",
        path: "/home/explore",
      },
      {
        icon: <MessageCircle size={22} />,
        text: "Messages",
        path: "/home/chats",
      },
      {
        icon: (
          <div className="relative w-fit">
            <Heart size={22} className="text-muted-foreground" />
            {notRead > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </div>
        ),
        text: "Notifications",
        path: "/home/notification",
      },
      {
        icon: <PlusSquare size={22} />,
        text: "Create",
        path: "/home/create",
      },
      {
        icon: (
          <Avatar className="w-7 h-7 border-2 border-pink-500">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              {user?.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ),
        text: "Profile",
        path: "/home/user/profile",
      },
    ],
    [user?.profilePicture, user?.username,notRead]
  );

  useEffect(() => {
    initiateSocket(user._id);
  }, []);

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
      await new Promise((r) => setTimeout(r, 2000));
      dispatch(logout());
    }
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-[250px] xl:w-[300px] border-r p-6 hidden md:flex flex-col justify-between h-screen bg-white">
      <div>
        <div
          className="text-3xl text-center font-bold mb-10 text-gray-800 select-none py-4"
          style={{ fontFamily: "Billabong, cursive" }}
        >
          Social Media
        </div>

        <nav className="flex flex-col gap-1">
          {sideItems.map((item) => (
            <Link
              href={item.path}
              key={item.text}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <span className="text-gray-700">{item.icon}</span>
              <span className="font-medium text-gray-800">{item.text}</span>
              {item.text === 'Notifications' && (notRead > 0 && <span className="bg-red-500 ring-2 ring-white px-2 rounded-full text-white">{notRead
                }</span>)}
            </Link>
          ))}
        </nav>
      </div>

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
    </aside>
  );
};

export default LeftSideBar
// export default memo(LeftSideBar);
