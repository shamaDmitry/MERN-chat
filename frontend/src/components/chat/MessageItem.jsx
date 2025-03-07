import classNames from "classnames";
import { useAuthStore } from "@/store/useAuthStore";
import { User2 } from "lucide-react";
import dayjs from "dayjs";

export const MessageItem = ({ message, receiver }) => {
  const { user } = useAuthStore();
  const isCurrentUser = message.senderId === user._id;

  return (
    <div
      className={classNames("chat", {
        "chat-start": !isCurrentUser,
        "chat-end": isCurrentUser,
      })}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full !flex items-center justify-center bg-base-300 ">
          {isCurrentUser && <img src={user.profilePic} alt="" />}
          {!isCurrentUser && <img src={receiver?.profilePic} alt="" />}

          {user.profilePic || receiver?.profilePic ? null : (
            <User2 className="size-4" />
          )}
        </div>
      </div>
      <div className="chat-header">
        {isCurrentUser && user.fullName}
        {!isCurrentUser && receiver?.fullName}

        <time className="text-xs opacity-50 ml-2">
          {new Date(message.createdAt).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}

          {dayjs(message.createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </time>
      </div>

      <div className="chat-bubble">{message.text}</div>
    </div>
  );
};
