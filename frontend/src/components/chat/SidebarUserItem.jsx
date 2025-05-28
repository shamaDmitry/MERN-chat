import { NavLink } from "react-router-dom";
import { User2 } from "lucide-react";
import { useChat } from "@/store/useChat";
import classNames from "classnames";

export const SidebarUserItem = ({ user }) => {
  const { unreadCounts } = useChat();
  const unreadCount = unreadCounts[user._id] || 0;

  return (
    <NavLink
      to={`/chat/${user._id}`}
      className={({ isActive }) =>
        classNames(
          "flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-base-200",
          {
            "bg-base-200": isActive,
          }
        )
      }
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User2 className="w-6 h-6" />
          )}
        </div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.fullName}</p>
      </div>
    </NavLink>
  );
};
