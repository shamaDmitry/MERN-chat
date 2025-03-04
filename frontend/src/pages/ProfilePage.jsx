import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, Trash2, User, UserIcon } from "lucide-react";
import dayjs from "dayjs";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { ConfirmModal } from "../components/ConfirmModal";

export const ProfilePage = () => {
  const { user, isUpdatingProfile, updateProfile, setUser } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const deletePhotoModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { fullName: user.fullName },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
    };
  };

  const onSubmit = async (data) => {
    const body = {
      fullName: data.fullName,
      profilePic: selectedImg || user.profilePic || null,
    };

    console.log("body", body);
    console.log("user.profilePic", user.profilePic);

    const res = await updateProfile(body);

    setUser(res);
  };

  const onError = (errors) => {
    console.log("errors form", errors);
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit, onError)}
              noValidate
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="size-32 rounded-full object-cover border-4 flex items-center justify-center bg-base-100 overflow-hidden">
                    {(user.profilePic || selectedImg) && (
                      <img
                        src={selectedImg || user.profilePic}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    )}

                    {!user.profilePic && <UserIcon className="size-10" />}
                  </div>

                  <label
                    htmlFor="avatar-upload"
                    className={classNames(
                      "absolute bottom-0 right-0 bg-base-content over:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200",
                      {
                        isUpdatingProfile: "animate-pulse pointer-events-none",
                      }
                    )}
                  >
                    <Camera className="w-5 h-5 text-base-200" />

                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>

                  {(user.profilePic || selectedImg) && (
                    <button
                      onClick={() => deletePhotoModalRef.current.showModal()}
                      type="button"
                      className="absolute bottom-0 left-0 bg-red-500 hover:bg-red-600 p-2 rounded-full cursor-pointer transition-all duration-200"
                      disabled={isUpdatingProfile}
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-zinc-400">
                  {isUpdatingProfile
                    ? "Uploading..."
                    : "Click the camera icon to update your photo"}
                </p>
              </div>

              <div className="form-control">
                <label className="label mb-1">
                  <span className="label-text font-medium">Email</span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail className="h-5 w-5 text-base-content/40" />
                  </div>

                  <input
                    disabled
                    autoComplete="off"
                    type="email"
                    className={classNames(`input input-bordered w-full pl-10`)}
                    placeholder="you@example.com"
                    defaultValue={user.email}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label mb-1">
                  <span className="label-text font-medium">Full Name</span>
                </label>

                <div className="relative">
                  <div className="z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>

                  <input
                    type="text"
                    autoComplete="off"
                    className={classNames(`input input-bordered w-full pl-10`, {
                      "input-error": errors.fullName,
                    })}
                    placeholder="John Doe"
                    {...register("fullName", {
                      required: {
                        value: true,
                        message: "Full name is required",
                      },
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  disabled={isUpdatingProfile}
                  type="submit"
                  className="btn btn-success"
                >
                  Save
                </button>
              </div>
            </form>

            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>
                    {dayjs(user.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Last updated</span>
                  <span>
                    {dayjs(user.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        dialogRef={deletePhotoModalRef}
        id="delete-photo-modal"
        handleConfirm={async () => {
          const res = await updateProfile({
            fullName: user.fullName,
            profilePic: null,
          });

          setSelectedImg(null);
          setUser(res);
          deletePhotoModalRef.current.close();
        }}
        handleCancel={() => {
          deletePhotoModalRef.current.close();
        }}
      />
    </>
  );
};
