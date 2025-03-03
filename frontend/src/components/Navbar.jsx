import { LogOut, Settings, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Headline } from "@/components/Headline";
import { Logo } from "@/components/Logo";
import { ConfirmModal } from "./ConfirmModal";

export const Navbar = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    // <div className="container">
    //   <div className="flex justify-between items-center p-4 border-b">
    //     <nav className="flex gap-2">
    //       <NavLink className="flex py-2 px-4 border" to="/">
    //         Home
    //       </NavLink>
    //       <NavLink className="flex py-2 px-4 border" to="/settings">
    //         settings
    //       </NavLink>
    //       <NavLink className="flex py-2 px-4 border" to="/profile">
    //         profile
    //       </NavLink>
    //     </nav>

    //     <div className="flex gap-2 items-center">
    //       <div className="avatar avatar-online avatar-placeholder">
    //         <div className="bg-neutral text-neutral-content w-16 rounded-full">
    //           <span className="text-xl">{user?.fullName}</span>
    //         </div>
    //       </div>

    //       <div className="tooltip tooltip-bottom" data-tip="Log out">
    //         <button
    //           className="btn btn-square"
    //           onClick={() => document.getElementById("my_modal_2").showModal()}
    //         >
    //           <LogOut className="size-4" />
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   <dialog id="my_modal_2" className="modal">
    //     <div className="modal-box text-center">
    //       <h3 className="font-bold text-lg mb-5">Log out?</h3>

    //       <div className="flex gap-2 items-center justify-center">
    //         <button className="btn btn-secondary" onClick={handleLogOut}>
    //           Yes
    //         </button>
    //         <button className="btn btn-secondary">No</button>
    //       </div>
    //     </div>
    //     <form method="dialog" className="modal-backdrop">
    //       <button>close</button>
    //     </form>
    //   </dialog>
    // </div>
    <>
      <header className="border-b border-base-300 backdrop-blur-lg bg-base-100/80">
        <div className="container mx-auto px-4 h-16">
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
              <div className="tooltip tooltip-bottom" data-tip="Settings">
                <NavLink
                  to={"/settings"}
                  className={`btn btn-sm gap-2 transition-colors`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </NavLink>
              </div>

              {user && (
                <>
                  <div className="tooltip tooltip-bottom" data-tip="Profile">
                    <NavLink to={"/profile"} className={`btn btn-sm gap-2`}>
                      <User className="size-5" />
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
