export default function SkeletonTable() {
  return (
    <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="relative rounded-3xl shadow-lg border border-blue-100 overflow-hidden flex flex-col min-h-[320px] bg-white/90 backdrop-blur-md animate-pulse"
        >
          {/* Date badge */}
          <div className="absolute top-6 left-6">
            <div className="w-24 h-6 bg-gray-200 rounded-full" />
          </div>
          {/* Card Content */}
          <div className="flex flex-col justify-between flex-1 pt-20 p-7">
            {/* Title & Status */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2/3 bg-gray-200 rounded-lg h-7" />
                <div className="w-16 h-5 ml-2 bg-gray-200 rounded-full" />
              </div>
              <div className="w-full h-4 mb-2 bg-gray-200 rounded" />
              <div className="w-5/6 h-4 mb-2 bg-gray-200 rounded" />
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="w-20 h-5 bg-gray-200 rounded-full" />
              <div className="w-16 h-5 bg-gray-200 rounded-full" />
            </div>
            {/* Actions */}
            <div className="flex items-center justify-between pt-2 mt-auto border-t border-blue-100">
              <div className="flex gap-2">
                <div className="bg-gray-200 rounded-full h-9 w-14" />
                <div className="bg-gray-200 rounded-full h-9 w-14" />
              </div>
              <div className="bg-gray-200 rounded-full h-9 w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
