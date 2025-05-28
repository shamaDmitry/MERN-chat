import { Outlet } from "react-router-dom";
import { useChat } from "../store/useChat";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Headline } from "../components/Headline";
import { UserListItem } from "../components/user/UserListItem";
import { useMemo } from "react";

export const HomePage = () => {
  const {
    usersForSidebar,
    getUsersForSidebar,
    isLoadingUsers,
    getUnreadCount,
  } = useChat();
  const { user: currentUser, onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsersForSidebar();
    getUnreadCount();
  }, [getUsersForSidebar, getUnreadCount]);

  const sortedUsers = useMemo(() => {
    return [...usersForSidebar].sort((a, b) => {
      const isAOnline = onlineUsers.includes(a._id);
      const isBOnline = onlineUsers.includes(b._id);

      if (isAOnline && !isBOnline) return -1;
      if (!isAOnline && isBOnline) return 1;

      // If both have the same online status, sort alphabetically by name
      return a.fullName.localeCompare(b.fullName);
    });
  }, [usersForSidebar, onlineUsers]);

  return (
    <div className="container">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-primary drawer-button lg:hidden"
      >
        Open chats
      </label>

      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content px-4">
          <Outlet />
        </div>

        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          />

          <div className="min-h-full bg-base-100 w-50 border-r border-r-base-300 px-4 py-4 lg:py-0">
            {isLoadingUsers ? (
              <div className="flex items-center justify-center">
                <span className="loading loading-dots loading-md"></span>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <Headline tag="h5">You:</Headline>

                  <UserListItem
                    currentUser={currentUser}
                    isOnline={onlineUsers.includes(currentUser._id)}
                  />
                </div>

                <div className="mb-5">
                  <Headline tag="h5">Users:</Headline>

                  <ul className="menu p-0 text-base-content w-full">
                    {sortedUsers.map((user) => {
                      return (
                        <UserListItem
                          key={user._id}
                          to={`/chat/${user._id}`}
                          currentUser={user}
                          isOnline={onlineUsers.includes(user._id)}
                          userId={user._id}
                        />
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
