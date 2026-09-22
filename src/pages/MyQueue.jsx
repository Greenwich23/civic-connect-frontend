import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useIssues } from "../hooks/useIssues";
import IssueCard from "../components/issue/IssueCard";
import IssueCardSkeleton from "../components/issue/IssueCardSkeleton";

export default function MyQueue() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const communityId =
    user?.representativeInfo?.community?._id ||
    user?.representativeInfo?.community;

  const { data: issues, isLoading } = useIssues({ community: communityId });

  return (
    <div>
      <h1 className="font-display font-800 text-[#1E293B] text-3xl mb-1">
        My Community Queue
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        {issues?.length ?? 0} issues in your community.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <IssueCardSkeleton key={i} />
            ))
          : issues?.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onClick={() => navigate(`/issues/${issue._id}`)}
              />
            ))}
      </div>
    </div>
  );
}
