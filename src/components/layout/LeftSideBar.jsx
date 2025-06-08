"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { initiateSocket } from "@/lib/socket";
import Header from "../common/LeftSideBar/Header";
import LogoutButton from "../common/LeftSideBar/LogoutButton";
import SideNavs from "../common/LeftSideBar/SideNavs";

const LeftSideBar = () => {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    initiateSocket(user._id);
  }, []);

  return (
    <aside className="fixed top-0 left-0 z-40 w-[250px] xl:w-[300px] border-r p-6 hidden md:flex flex-col justify-between h-screen bg-white">
      <div>
        <Header />

        <SideNavs user={user} />
      </div>

      <LogoutButton />
    </aside>
  );
};

export default LeftSideBar;
// export default memo(LeftSideBar);
