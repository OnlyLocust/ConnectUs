"use client";

import React from "react";
import AuthHeader from "./AuthHeader";
import ThemeToggle from "../ThemeToggle";

const AuthPageWrapper = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-background dark:to-card flex items-center justify-center p-4">
      <ThemeToggle className="absolute top-4 right-4 z-10" />

      <div className="w-full max-w-md space-y-6">
        <AuthHeader />
        {children}

        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ConnectUs. All rights reserved.</p>
        </div>
        </div>
    </div>
  );
};

export default AuthPageWrapper;
