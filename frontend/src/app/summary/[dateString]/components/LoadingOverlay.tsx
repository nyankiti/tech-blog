export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-10 rounded-md">
      <div className="flex items-center space-x-2">
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}
