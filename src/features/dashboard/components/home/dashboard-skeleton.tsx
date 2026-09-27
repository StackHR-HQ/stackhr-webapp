export function DashboardSkeleton() {
  return (
    <div className="max-w-[1400px] space-y-6">
      <div className="h-16 animate-pulse rounded-panel border border-line bg-surface" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-panel border border-line bg-surface" />
        ))}
      </div>
    </div>
  )
}
