export default function SkeletonStats() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 animate-pulse">
      {/* Pills Row */}
      <div className="flex flex-col items-center gap-4 mt-6 sm:flex-row sm:justify-center mb-6 w-full">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-48 sm:w-56 bg-gray-200 rounded-full mx-2"
          />
        ))}
      </div>
      {/* Stats Card Skeleton */}
      <div className="w-full max-w-xl p-6 mt-6 bg-gray-100 rounded-2xl flex flex-col items-center">
        <div className="w-1/2 h-6 mb-4 bg-gray-200 rounded" />
        <div className="w-3/4 h-4 mb-3 bg-gray-200 rounded" />
        <div className="w-full h-3 bg-gray-200 rounded-full mb-2" />
        <div className="flex justify-between w-full mt-2">
          <span className="w-10 h-4 bg-gray-200 rounded" />
          <span className="w-10 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
