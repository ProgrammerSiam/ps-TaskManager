export default function SkeletonStats() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 bg-gray-100 rounded-2xl h-24" />
        ))}
      </div>
      <div className="p-6 mt-6 bg-gray-100 rounded-2xl">
        <div className="w-1/3 h-6 mb-4 bg-gray-200 rounded" />
        <div className="w-full h-3 bg-gray-200 rounded-full mb-2" />
        <div className="flex justify-between mt-2 text-xs text-gray-300">
          <span className="w-8 h-4 bg-gray-200 rounded" />
          <span className="w-8 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
