"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { initiateSocket } from "@/lib/socket";
import Header from "../common/LeftSideBar/Header";
import LogoutButton from "../common/LeftSideBar/LogoutButton";
import SideNavs from "../common/LeftSideBar/SideNavs";
import { Menu } from "lucide-react";

const LeftSideBar = () => {
  const user = useSelector((state) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 20, y: 20 });
  const btnRef = useRef(null);

  useEffect(() => {
    if (user?._id) initiateSocket(user._id);
  }, [user]);

  // Custom drag logic
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    let offsetX = 0;
    let offsetY = 0;

    const handlePointerDown = (e) => {
      e.preventDefault();
      offsetX = e.clientX - dragOffset.x;
      offsetY = e.clientY - dragOffset.y;

      const handlePointerMove = (e) => {
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Clamp to window boundaries
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setDragOffset({ x: newX, y: newY });
      };

      const handlePointerUp = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    };

    el.addEventListener("pointerdown", handlePointerDown);

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [dragOffset]);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen bg-white border-r p-6
          transition-transform duration-300 ease-in-out
          w-[250px] xl:w-[300px]
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

      {/* Stylish Movable Hamburger (Mobile Only) */}
      <div
        ref={btnRef}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          transition: "transform 0.05s linear",
        }}
        className="md:hidden fixed z-50 cursor-grab"
      >
        <button
          className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                     text-white shadow-xl rounded-full p-3 border border-white 
                     active:scale-95 transition-all duration-200"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        ></div>
      )}
    </>
  );
};

export default LeftSideBar;
