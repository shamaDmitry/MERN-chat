import { MessageSquare } from "lucide-react";

import classNames from "classnames";

export const Logo = ({ className }) => {
  return (
    <div
      className={classNames(
        `size-12 rounded-xl bg-primary/10 flex items-center justify-center 
group-hover:bg-primary/20 transition-colors`,
        className
      )}
    >
      <MessageSquare className="size-6 text-primary" />
    </div>
  );
};
