import { useNavigate } from "react-router-dom";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useClearAllNotifications,
} from "../hooks/useNotifications";

const TYPE_ICONS = {
  new_support: { icon: "▲", bg: "bg-green-50" },
  new_comment: { icon: "💬", bg: "bg-blue-50" },
  proposal_voting_started: { icon: "🗳️", bg: "bg-amber-50" },
  status_updated: { icon: "🏛️", bg: "bg-purple-50" },
  issue_resolved: { icon: "✅", bg: "bg-green-50" },
  application_approved: { icon: "🎉", bg: "bg-green-50" },
  application_rejected: { icon: "⚠️", bg: "bg-red-50" },
};

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function isToday(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  return diffMs < 1000 * 60 * 60 * 6; // treat last 6 hours as "New"
}

function NotificationRow({ notification, onRead, onClick }) {
  const { icon, bg } = TYPE_ICONS[notification.type] || {
    icon: "🔔",
    bg: "bg-slate-100",
  };

  return (
    <div
      onClick={() => {
        if (!notification.isRead) onRead(notification._id);
        onClick(notification);
      }}
      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
        notification.isRead
          ? "bg-white border-[#E2E8F0] hover:border-[#0F766E]/20"
          : "bg-white border-[#0F766E]/20 hover:border-[#0F766E]/40"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center text-[14px] shrink-0`}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-[#1E293B]">{notification.message}</p>
        <p className="text-[12px] text-[#94A3B8] mt-0.5">
          {timeAgo(notification.createdAt)}
        </p>
      </div>

      {!notification.isRead && (
        <span className="w-2 h-2 rounded-full bg-[#0F766E] shrink-0" />
      )}
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-[#E2E8F0] bg-white animate-pulse">
      <div className="w-9 h-9 rounded-full bg-[#F1F5F9] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/4 bg-[#F1F5F9] rounded" />
        <div className="h-3 w-1/4 bg-[#F1F5F9] rounded" />
      </div>
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();
  const { data, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const clearAll = useClearAllNotifications();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const newNotifications = notifications.filter((n) => isToday(n.createdAt));
  const earlierNotifications = notifications.filter(
    (n) => !isToday(n.createdAt),
  );

  const handleNotificationClick = (notification) => {
    if (notification.relatedIssue?._id) {
      navigate(`/issues/${notification.relatedIssue._id}`);
    }
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all notifications? This cannot be undone.",
    );
    if (confirmed) {
      clearAll.mutate();
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-800 text-[#1E293B] text-3xl mb-1">
            Notifications
          </h1>
          <p className="text-[13px] text-[#64748B]">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="text-[13px] font-600 text-[#0F766E] hover:underline"
            >
              Mark all read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={clearAll.isPending}
              className="text-[13px] font-600 text-[#DC2626] hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center">
          <div className="text-3xl mb-2">🔔</div>
          <h3 className="font-600 text-[#1E293B] text-[14px]">
            No notifications yet
          </h3>
          <p className="text-[13px] text-[#64748B] mt-1">
            You'll be notified when there's activity on issues you've reported
            or followed.
          </p>
        </div>
      )}

      {!isLoading && newNotifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider mb-3">
            New
          </h2>
          <div className="space-y-3">
            {newNotifications.map((notification) => (
              <NotificationRow
                key={notification._id}
                notification={notification}
                onRead={(id) => markAsRead.mutate(id)}
                onClick={handleNotificationClick}
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && earlierNotifications.length > 0 && (
        <div>
          <h2 className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider mb-3">
            Earlier
          </h2>
          <div className="space-y-3">
            {earlierNotifications.map((notification) => (
              <NotificationRow
                key={notification._id}
                notification={notification}
                onRead={(id) => markAsRead.mutate(id)}
                onClick={handleNotificationClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
