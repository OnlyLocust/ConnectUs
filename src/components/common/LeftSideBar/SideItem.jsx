import Link from "next/link";
import React from "react";

const SideItem = ({path,text,icon ,notRead , onItemClick }) => {
  return (
    <Link
      href={path}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
      onClick={onItemClick}
    >
      <span className="text-gray-700">{icon}</span>
      <span className="font-medium text-gray-800">{text}</span>
      {text === "Notifications" && notRead > 0 && (
        <span className="bg-red-500 ring-2 ring-white px-2 rounded-full text-white">
          {notRead}
        </span>
      )}
    </Link>
  );
};

export default SideItem;
