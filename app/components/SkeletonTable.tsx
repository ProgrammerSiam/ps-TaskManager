export default function SkeletonTable() {
  return (
    <table className="w-full mt-4 bg-white border animate-pulse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Title</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Due Date</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(4)].map((_, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </td>
            <td className="p-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </td>
            <td className="p-2">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </td>
            <td className="p-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
