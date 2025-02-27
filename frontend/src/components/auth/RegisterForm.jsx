import { Loader2, Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import PasswordInput from "./PasswordInput";
import { useForm } from "react-hook-form";
import classNames from "classnames";

export const RegisterForm = () => {
  const { signup, isSigningUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = (data) => {
    signup(data);
  };

  const onError = (errors) => {
    Object.keys(errors).forEach((key) => {
      toast.error(errors[key].message || `${key} is required`, {
        duration: 1000,
      });
    });
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit, onError)}
      noValidate
    >
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

      <div className="form-control">
        <label className="label mb-1">
          <span className="label-text font-medium">Email</span>
        </label>

        <div className="relative">
          <div className="z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="size-5 text-base-content/40" />
          </div>

          <input
            autoComplete="off"
            type="email"
            className={classNames(`input input-bordered w-full pl-10`, {
              "input-error": errors.email,
            })}
            placeholder="you@example.com"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label mb-1">
          <span className="label-text font-medium">Password</span>
        </label>

        <PasswordInput
          autoComplete="off"
          className={classNames(`input input-bordered w-full pl-10`, {
            "input-error": errors.password,
          })}
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
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
