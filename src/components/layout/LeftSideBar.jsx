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
    // On first mount, place button in bottom right
    const initialX = window.innerWidth - 60;
    const initialY = window.innerHeight - 60;
    setDragOffset({ x: initialX, y: initialY });
  }, []);

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
          <SideNavs
            user={user}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
        <LogoutButton />
      </aside>

      <div
        ref={btnRef}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          transition: "transform 0.1s cubic-bezier(0.18, 0.89, 0.32, 1.28)",
        }}
        className="md:hidden fixed z-50 cursor-grab active:cursor-grabbing"
      >
        <button
          className="relative bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 
               text-white shadow-lg rounded-full p-2.5 border border-white/20 
               hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300
               group overflow-hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >

          <div
            className="absolute inset-0 bg-gradient-to-br from-amber-400 to-pink-500 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
          />


          <div className="relative flex flex-col items-center justify-center w-5 h-5">
            <span
              className={`absolute block h-0.5 w-5 bg-white rounded-full transition-all duration-300 
                        ${
                          isMobileMenuOpen
                            ? "rotate-45 translate-y-0"
                            : "-translate-y-1.5"
                        }`}
            />
            <span
              className={`absolute block h-0.5 w-5 bg-white rounded-full transition-all duration-300 
                        ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute block h-0.5 w-5 bg-white rounded-full transition-all duration-300 
                        ${
                          isMobileMenuOpen
                            ? "-rotate-45 translate-y-0"
                            : "translate-y-1.5"
                        }`}
            />
          </div>

          {/* Subtle pulsing glow effect */}
          <div
            className="absolute inset-0 rounded-full border border-white/10 animate-ping 
                    opacity-0 group-hover:opacity-20 duration-1000"
          />
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
