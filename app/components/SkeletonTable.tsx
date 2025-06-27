export default function SkeletonTable() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="relative rounded-3xl shadow-lg border border-blue-100 overflow-hidden flex flex-col min-h-[320px] bg-white/90 backdrop-blur-md animate-pulse"
        >
          {/* Date badge */}
          <div className="absolute top-6 left-6">
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>
          {/* Card Content */}
          <div className="flex-1 flex flex-col justify-between p-7 pt-20">
            {/* Title & Status */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-2/3 bg-gray-200 rounded-lg" />
                <div className="h-5 w-16 bg-gray-200 rounded-full ml-2" />
              </div>
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-5/6 bg-gray-200 rounded mb-2" />
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-5 w-20 bg-gray-200 rounded-full" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>
            {/* Actions */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-blue-100">
              <div className="flex gap-2">
                <div className="h-9 w-14 bg-gray-200 rounded-full" />
                <div className="h-9 w-14 bg-gray-200 rounded-full" />
              </div>
              <div className="h-9 w-14 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
