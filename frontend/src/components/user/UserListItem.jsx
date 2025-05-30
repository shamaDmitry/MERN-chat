import classNames from "classnames";
import { User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useChat } from "@/store/useChat";

export const UserListItem = ({ currentUser, isOnline, to, userId }) => {
  const { user } = useAuthStore();
  const { unreadCounts } = useChat();
  const unreadCount = unreadCounts[userId] || 0;

  console.log("unreadCounts", unreadCounts);
  console.log("userId", userId);
  console.log("unreadCount", unreadCount);

  const content = (
    <>
      <div className="relative shrink-0">
        {currentUser.profilePic ? (
          <img
            src={currentUser.profilePic}
            alt={currentUser.fullName}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <div className="size-10 rounded-full object-cover bg-base-300 flex items-center justify-center">
            <User className="size-5" />
          </div>
        )}
        <span
          className={classNames(
            "absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-base-100",
            {
              "bg-green-500": isOnline,
              "bg-red-500": !isOnline,
            }
          )}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      <div className="block text-left min-w-0">
        <div className="font-medium truncate" title={`${currentUser.fullName}`}>
          {currentUser.fullName}{" "}
          {currentUser._id === user._id && (
            <span className="text-zinc-400 text-sm">You</span>
          )}
        </div>
        <div className="text-sm text-zinc-400">
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </>
  );

  if (to) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) => {
          return classNames({
            "flex items-center gap-2 py-2 px-2 rounded-md hover:bg-base-200": true,
            "bg-base-200": isActive,
          });
        }}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <div className="flex items-center gap-2 py-2 px-2 rounded-md">
      {content}
    </div>
  );
};
