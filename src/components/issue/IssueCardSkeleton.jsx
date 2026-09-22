export default function IssueCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-[#F1F5F9]" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-1/3 bg-[#F1F5F9] rounded" />
        <div className="h-4 w-3/4 bg-[#F1F5F9] rounded" />
        <div className="h-3 w-full bg-[#F1F5F9] rounded" />
      </div>
    </div>
  );
}
