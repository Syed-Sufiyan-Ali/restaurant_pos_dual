export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-2/3" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-6 bg-gray-200 rounded-full w-24" />
          <div className="h-10 w-10 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
export function DealCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded-full w-3/4" />
        <div className="h-4 bg-gray-100 rounded-full w-full" />
        <div className="h-8 bg-gray-200 rounded-xl w-full mt-4" />
      </div>
    </div>
  );
}
