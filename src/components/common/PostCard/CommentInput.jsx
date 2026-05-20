import React, { useState } from "react";

const CommentInput = ({ commentPost }) => {
  const [localComment, setLocalComment] = useState("");

  const handlePost = () => {
    if (localComment.trim()) {
      commentPost(localComment);
      setLocalComment("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePost();
    }
  };

  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Add a comment..."
          className="text-sm w-full focus:outline-none"
          value={localComment}
          onChange={(e) => setLocalComment(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Add a comment"
        />
        <button
          className="text-blue-500 font-semibold text-sm ml-auto"
          onClick={handlePost}
          aria-label="Post comment"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
