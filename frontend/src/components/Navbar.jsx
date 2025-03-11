import { LogOut, MessagesSquare, Settings, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Headline } from "@/components/Headline";
import { Logo } from "@/components/Logo";
import { ConfirmModal } from "./ConfirmModal";
import classNames from "classnames";

export const Navbar = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <header className="border-b border-base-300 backdrop-blur-lg bg-base-100/80 mb-8">
        <div className="container h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8">
              <NavLink
                to="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition-all"
              >
                <Logo />

                <Headline className="text-lg font-bold">Chat</Headline>
              </NavLink>
            </div>

            <div className="flex items-center gap-2">
              <div className="tooltip tooltip-bottom" data-tip="Rooms">
                <NavLink
                  to={"/rooms"}
                  className={({ isActive }) => {
                    return classNames("btn btn-sm gap-2 transition-colors", {
                      "btn-primary": isActive,
                    });
                  }}
                >
                  <MessagesSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Rooms</span>
                </NavLink>
              </div>

              <div className="tooltip tooltip-bottom" data-tip="Settings">
                <NavLink
                  to={"/settings"}
                  className={({ isActive }) => {
                    return classNames("btn btn-sm gap-2 transition-colors", {
                      "btn-primary": isActive,
                    });
                  }}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </NavLink>
              </div>

              {user && (
                <>
                  <div className="tooltip tooltip-bottom" data-tip="Profile">
                    <NavLink
                      to={"/profile"}
                      className={({ isActive }) => {
                        return classNames(
                          "btn btn-sm gap-2 transition-colors",
                          {
                            "btn-primary": isActive,
                          }
                        );
                      }}
                    >
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.fullName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <User className="size-5" />
                      )}
                      <span className="hidden sm:inline">Profile</span>
                    </NavLink>
                  </div>

                  <div className="tooltip tooltip-bottom" data-tip="Logout">
                    <button
                      className="btn btn-sm outline-none focus-visible:outline-none"
                      onClick={() =>
                        document.getElementById("logout-modal").showModal()
                      }
                    >
                      <LogOut className="size-5" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <ConfirmModal
        id="logout-modal"
        handleCancel={() => {
          console.log("cancel");
        }}
        handleConfirm={() => {
          handleLogOut();
        }}
      />
    </>
  );
};
