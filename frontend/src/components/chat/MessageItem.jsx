import classNames from "classnames";
import { useAuthStore } from "@/store/useAuthStore";
import { User2 } from "lucide-react";
import dayjs from "dayjs";

export const MessageItem = ({ message, receiver, className }) => {
  const { user } = useAuthStore();
  const isCurrentUser = message.senderId === user._id;

  return (
    <div
      className={classNames(`chat ${className}`, {
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
          {dayjs(message.createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </time>
      </div>

      <div className="chat-bubble flex flex-col">
        {message.image && (
          <img
            src={message.image}
            alt="Attachment"
            className="sm:max-w-[200px] rounded-md mb-2"
          />
        )}
        {message.text && <p>{message.text}</p>}
      </div>
    </div>
  );
};
