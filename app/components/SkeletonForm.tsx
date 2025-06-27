export default function SkeletonForm() {
  return (
    <div className="flex flex-col gap-8 p-8 border border-blue-100 shadow-lg bg-white/95 rounded-3xl sm:p-10 backdrop-blur-md animate-pulse w-full max-w-xl mx-auto">
      <div className="h-8 w-1/3 bg-gray-200 rounded mb-6 mx-auto" />{" "}
      {/* Title */}
      <div className="mb-2">
        <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-12 w-full bg-gray-200 rounded-xl" />
      </div>
      <div className="mb-2">
        <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-20 w-full bg-gray-200 rounded-xl" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <div className="h-5 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-12 w-full bg-gray-200 rounded-xl" />
        </div>
        <div className="flex-1">
          <div className="h-5 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-12 w-full bg-gray-200 rounded-xl" />
        </div>
      </div>
      <div className="h-12 w-full bg-gray-200 rounded-xl mt-4" /> {/* Button */}
    </div>
  );
}
