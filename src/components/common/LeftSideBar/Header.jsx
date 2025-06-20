import React from "react";

const Header = () => {
  return (
    <div
      className="text-3xl text-center font-bold mb-10 text-gray-800 select-none py-4 flex items-center"
      style={{ fontFamily: "Billabong, cursive" }}
    >

      <img src="/logo.ico" alt="Logo" width={60}/> 
      {/* ConnectUs */}
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
  );
};

export default Header;
