import React from "react";

const AuthHeader = () => {
  return (
    <div className="text-center">
      {/* <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
      ConnectUs
      </h1> */}
      <h1
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "2.5rem",
          letterSpacing: "1px",
          textShadow: "0 0 6px rgba(0, 255, 255, 0.4)",
        }}
      >
        <span style={{ color: "#00bfff" }}>Connect</span>
        <span style={{ color: "#ff6ec7" }}>Us</span>
      </h1>

      <p className="text-gray-600">
        Connect with friends and the world around you
      </p>
    </div>
  );
};

export default AuthHeader;
