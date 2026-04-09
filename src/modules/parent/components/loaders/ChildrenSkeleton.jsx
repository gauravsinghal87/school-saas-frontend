const ChildrenSkeleton = () => (
  <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="animate-pulse flex-shrink-0 w-[260px] h-[88px] bg-surface-card border border-border rounded-2xl flex items-center p-4 gap-4"
      >
        <div className="w-12 h-12 bg-surface-page rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface-page rounded w-3/4"></div>
          <div className="h-3 bg-surface-page rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export default ChildrenSkeleton