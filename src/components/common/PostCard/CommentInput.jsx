import React from "react";

const CommentInput = ({comment, commentHandler, commentPost}) => {
  return (
    <div className="border-t border-gray-100 p-3">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Add a comment..."
          className="text-sm w-full focus:outline-none"
          value={comment}
          onChange={commentHandler}
          aria-label="Add a comment"
        />
        <button
          className="text-blue-500 font-semibold text-sm ml-auto"
          onClick={commentPost}
          aria-label="Post comment"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
