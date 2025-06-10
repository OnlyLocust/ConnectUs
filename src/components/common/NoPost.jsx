const NoPosts = ({
  icon = (
    <svg
      className="w-12 h-12 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  title = "No posts yet",
  description = "When you create posts, they'll appear here",

}) => {
  return (
    <div className="animate-fadeIn flex flex-col items-center justify-center p-6 text-center bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="mb-4 p-4 bg-gray-50 rounded-full">{icon}</div>

      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>

      <p className="text-gray-500 mb-6 max-w-md">{description}</p>

    </div>
  );
};

export default NoPosts;
