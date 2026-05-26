export const CardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="w-full h-48 bg-gray-200" />

      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  )
}