"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initiateSocket } from "@/lib/socket";
import Header from "../common/LeftSideBar/Header";
import LogoutButton from "../common/LeftSideBar/LogoutButton";
import SideNavs from "../common/LeftSideBar/SideNavs";
import { setIsMobileMenuOpen } from "@/store/uiSlice";

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isMobileMenuOpen = useSelector((state) => state.ui.isMobileMenuOpen);
  const isHideHam = useSelector((state) => state.ui.isHideHam);

  useEffect(() => {
    if (user?._id) initiateSocket(user._id);
  }, [user]);

  const setMobileView = (set) => {
    dispatch(setIsMobileMenuOpen(set));
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen bg-white border-r p-6
          transition-transform duration-300 ease-in-out
          w-[300px] 
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex
          flex-col justify-between
        `}
      >
        <div>
          <Header />
          <SideNavs user={user} />
        </div>
        <LogoutButton />
      </aside>


      {!isHideHam && (
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button
            className="relative bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 
                   text-white shadow-lg rounded-full p-2.5 border border-white/20 
                   hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300
                   group overflow-hidden"
            onClick={() => setMobileView(!isMobileMenuOpen)}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-amber-400 to-pink-500 opacity-0 
                        group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
            />
            <div className="relative flex flex-col items-center justify-center w-5 h-5">
              <span
                className={`absolute block h-0.5 w-5 bg-white rounded-full transition-all duration-300 
                  ${isMobileMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"}`}
              />
              <span
                className={`absolute block h-0.5 w-5 bg-white rounded-full transition-all duration-300 
                  ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute block h-0.5 w-5 bg-white rounded-full transition-all duration-300 
                  ${isMobileMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"}`}
              />
            </div>
            <div
              className="absolute inset-0 rounded-full border border-white/10 animate-ping 
                        opacity-0 group-hover:opacity-20 duration-1000"
            />
          </button>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setMobileView(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        ></div>
      )}
    </>
  );
};

export default LeftSideBar;
