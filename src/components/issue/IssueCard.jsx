const STATUS_BADGE_STYLES = {
  reported: "bg-blue-50 text-blue-700",
  under_review: "bg-amber-50 text-amber-700",
  action_planned: "bg-purple-50 text-purple-700",
  in_progress: "bg-orange-50 text-orange-700",
  resolved: "bg-green-50 text-green-700",
};

const STATUS_LABELS = {
  reported: "Reported",
  under_review: "Under Review",
  action_planned: "Action Planned",
  in_progress: "In Progress",
  resolved: "Resolved",
};

const CATEGORY_ICONS = {
  roads: "🚗",
  waste: "♻️",
  lighting: "💡",
  water: "💧",
  safety: "🛡️",
  environment: "🌿",
  public: "🏛️",
};

export default function IssueCard({ issue, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      {issue.images?.[0] && (
        <img
          src={issue.images[0]}
          alt={issue.title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-[12px] text-[#64748B] flex items-center gap-1">
            {CATEGORY_ICONS[issue.category] || "📌"} {issue.category}
          </span>
          <span
            className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${
              STATUS_BADGE_STYLES[issue.status]
            }`}
          >
            {STATUS_LABELS[issue.status]}
          </span>
        </div>

        <h3 className="font-600 text-[#1E293B] text-[14px] mb-1.5 leading-snug">
          {issue.title}
        </h3>

        <p className="text-[12px] text-[#64748B] mb-3 line-clamp-2">
          {issue.description}
        </p>

        <div className="flex items-center justify-between gap-2 text-[12px] text-[#64748B]">
          <span className="min-w-0 truncate">
            📍 {issue.community?.name}
            {issue.community?.parent?.name
              ? `, ${issue.community.parent.name}`
              : ""}
          </span>
          <span className="flex items-center gap-3 shrink-0">
            <span>▲ {issue.supportCount ?? 0}</span>
            <span>💬 {issue.commentCount ?? 0}</span>
          </span>
        </div>

        <div className="text-[11px] text-[#94A3B8] mt-2">
          {new Date(issue.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
