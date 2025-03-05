import { NavLink, Outlet } from "react-router-dom";
import { useChat } from "../store/useChat";
import { useEffect } from "react";
import { User } from "lucide-react";
import classNames from "classnames";
import { useAuthStore } from "../store/useAuthStore";
import { Headline } from "../components/Headline";

export const HomePage = () => {
  const { usersForSidebar, getUsersForSidebar, isLoadingUsers } = useChat();
  const { user: currentUser, onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsersForSidebar();
  }, [getUsersForSidebar]);

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

                  <div className="flex items-center gap-2 py-2 px-2 rounded-md">
                    <div className="relative mx-auto lg:mx-0">
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
                            "bg-green-500": onlineUsers.includes(
                              currentUser._id
                            ),
                            "bg-red-500": !onlineUsers.includes(
                              currentUser._id
                            ),
                          }
                        )}
                      />
                    </div>

                    <div className="block text-left min-w-0">
                      <div className="font-medium truncate">
                        {currentUser.fullName}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {onlineUsers.includes(currentUser._id)
                          ? "Online"
                          : "Offline"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <Headline tag="h5">Users:</Headline>

                  <ul className="menu p-0 text-base-content w-full">
                    {usersForSidebar.map((user) => {
                      return (
                        <NavLink
                          to={`/chat/${user._id}`}
                          key={user._id}
                          className={({ isActive }) => {
                            return classNames({
                              "flex items-center gap-2 py-2 px-2 rounded-md hover:bg-base-200": true,
                              "bg-base-200": isActive,
                            });
                          }}
                        >
                          <div className="relative mx-auto lg:mx-0">
                            {user.profilePic ? (
                              <img
                                src={user.profilePic}
                                alt={user.fullName}
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
                                  "bg-green-500": onlineUsers.includes(
                                    user._id
                                  ),
                                  "bg-red-500": !onlineUsers.includes(user._id),
                                }
                              )}
                            />
                          </div>

                          <div className="block text-left min-w-0">
                            <div className="font-medium truncate">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-zinc-400">
                              {onlineUsers.includes(user._id)
                                ? "Online"
                                : "Offline"}
                            </div>
                          </div>
                        </NavLink>
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
