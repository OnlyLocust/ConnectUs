import React from "react";
import {
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import SideItem from "./SideItem";
import { useSelector } from "react-redux";
import ShowAvatar from "../ShowAvatar";

const SideNavs = ({user}) => {
  const notRead = useSelector((state) => state.auth.notRead);

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
          <ShowAvatar profilePicture={user?.profilePicture} username={user?.username} size={8} isUser={true}/>
        ),
        text: "Profile",
        path: `/home/user/profile/${user._id}`,
      },
    ],
    [user?.profilePicture, user?.username, notRead]
  );

  return (
    <nav className="flex flex-col gap-1">
      {sideItems.map((item) => (
        <SideItem path={item.path} text={item.text} icon={item.icon} notRead={notRead} key={item.text}/>
      ))}
    </nav>
  );
};

export default SideNavs;
