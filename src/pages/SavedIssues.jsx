import { useNavigate } from "react-router-dom";
import { useSavedIssues } from "../hooks/useSavedIssues";
import IssueCard from "../components/issue/IssueCard";
import IssueCardSkeleton from "../components/issue/IssueCardSkeleton";

export default function SavedIssues() {
  const navigate = useNavigate();
  const { data: savedIssues, isLoading } = useSavedIssues();

  const issueCount = savedIssues?.length ?? 0;

  return (
    <div>
      <h1 className="font-display font-800 text-[#1E293B] text-2xl sm:text-3xl mb-1">
        Saved Issues
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        {issueCount} {issueCount === 1 ? "issue" : "issues"} you're following.
        You'll be notified of updates.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <IssueCardSkeleton key={i} />
          ))}

        {!isLoading &&
          savedIssues?.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onClick={() => navigate(`/issues/${issue._id}`)}
            />
          ))}
      </div>

      {!isLoading && savedIssues?.length === 0 && (
        <div className="text-center py-16">
          <div className="text-3xl mb-2">🔖</div>
          <p className="text-[#94A3B8] text-[14px] mb-3">
            No saved issues yet. Follow issues you care about to track their
            progress here.
          </p>
          <button
            onClick={() => navigate("/issues")}
            className="text-[#0F766E] font-600 text-[13px] hover:underline"
          >
            Browse Issues
          </button>
        </div>
      )}
    </div>
  );
}
