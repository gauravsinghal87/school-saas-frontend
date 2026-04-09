const AttendanceSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-28 bg-surface-card border border-border rounded-2xl"
        ></div>
      ))}
    </div>
    <div className="h-64 bg-surface-card border border-border rounded-2xl"></div>
  </div>
);
export default AttendanceSkeleton;
