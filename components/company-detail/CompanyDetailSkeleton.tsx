export function CompanyDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-96 bg-gray-200 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}










