import React from "react";

const PostTab = ({selectedTab, postLength, bookmarkLength ,setSelectedTab}) => {

    const tabs = [
        ["Posts", postLength || '0'],
        ["Bookmarks", bookmarkLength || '0'],
      ]

  return (
    <div className="flex justify-around mb-10 border-b border-gray-300 relative">
      {tabs.map((tab) => (
        <button
          key={tab[0]}
          onClick={() => setSelectedTab(tab[0])}
          className={`relative px-4 py-2 text-base font-medium transition-all duration-300 ease-in-out 
      ${
        selectedTab === tab[0]
        
          ? "text-black font-bold"
          : "text-gray-500 hover:text-black"
      }`}
        >
          {tab[0]} {tab[1]}
          {/* Underline animation */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-all duration-300 ease-in-out 
          ${
            selectedTab === tab[0]
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          }`}
          />
        </button>
      ))}
    </div>
  );
};

export default PostTab;
