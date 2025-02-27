import { Loader2, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import PasswordInput from "./PasswordInput";

export const LoginForm = () => {
  const { isLoggingIn, login } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(e);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Email</span>
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Mail className="h-5 w-5 text-base-content/40" />
          </div>

          <input
            type="email"
            className={`input input-bordered w-full pl-10`}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Password</span>
        </label>

        <PasswordInput
          icon={<Lock className="size-5 text-base-content/40" />}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading...
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
};
