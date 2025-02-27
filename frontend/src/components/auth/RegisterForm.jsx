import { Loader2, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import PasswordInput from "./PasswordInput";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Full Name</span>
        </label>

        <div className="relative">
          <div className="z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="size-5 text-base-content/40" />
          </div>

          <input
            type="text"
            className={`input input-bordered w-full pl-10`}
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Email</span>
        </label>

        <div className="relative">
          <div className="z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="size-5 text-base-content/40" />
          </div>

          <input
            type="email"
            className={`input input-bordered w-full pl-10`}
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Password</span>
        </label>

        <PasswordInput
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          icon={<Lock className="size-5 text-base-content/40" />}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSigningUp}
      >
        {isSigningUp ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Loading...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};
