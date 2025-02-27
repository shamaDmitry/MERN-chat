import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(({ icon, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <div className="z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>

      <input
        type={showPassword ? "text" : "password"}
        className={`input input-bordered w-full pl-10`}
        placeholder="••••••••"
        ref={ref}
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="size-5 text-base-content/40" />
        ) : (
          <Eye className="size-5 text-base-content/40" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
