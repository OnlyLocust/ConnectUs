"use client";

import React from "react";
import ThemeToggle from "../ThemeToggle";

const Header = () => {
  return (
    <div className="flex items-start justify-between gap-2 mb-10">
      <div
        className="text-3xl text-center font-bold text-foreground select-none py-4 flex items-center flex-1 min-w-0"
        style={{ fontFamily: "Billabong, cursive" }}
      >
        <img src="/logo.ico" alt="ConnectUs logo" width={60} />
        <div
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: "2rem",
            letterSpacing: "1px",
            textShadow: "0 0 6px rgba(0, 255, 255, 0.4)",
          }}
        >
          <span style={{ color: "#00bfff" }}>Connect</span>
          <span style={{ color: "#ff6ec7" }}>Us</span>
        </div>
      </div>
      <ThemeToggle className="mt-4 shrink-0" />
    </div>
  );
};

export default Header;
