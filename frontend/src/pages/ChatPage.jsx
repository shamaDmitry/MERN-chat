import { MessagesSkeleton } from "@/components/skeletons/MessagesSkeleton";
import { Link, useParams } from "react-router-dom";
import { useChat } from "../store/useChat";
import { useEffect, useState } from "react";
import { ChevronLeft, User2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export const ChatPage = () => {
  const { getMessages, isLoadingMessages, sendMessage, messages } = useChat();
  const { user } = useAuthStore();
  const [message, setMessage] = useState("");
  const { userId } = useParams();

  useEffect(() => {
    getMessages(userId);
  }, [getMessages, userId]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const res = await sendMessage(userId, {
      text: message,
    });

    console.log("res", res);
  };

  return (
    <div className="flex flex-col min-h-full">
      <div>
        <Link to="/" className="gap-1.5 mb-4 btn btn-sm btn-primary">
          <ChevronLeft className="size-4" />

          <span className="capitalize">back</span>
        </Link>
      </div>

      {isLoadingMessages ? (
        <MessagesSkeleton count={4} className="w-full" />
      ) : (
        <div className="flex-1 flex flex-col">
          <div>
            {messages.map((message) => {
              console.log("message", message);

              return (
                <div
                  key={message._id}
                  className={`chat ${
                    message.senderId === user._id ? "chat-end" : "chat-start"
                  }`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full !flex items-center justify-center bg-base-300 ">
                      <User2 className="size-4" />
                    </div>
                  </div>
                  <div className="chat-header">
                    {message.senderId}
                    <time className="text-xs opacity-50 ml-2">
                      {new Date(message.createdAt).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </time>
                  </div>
                  <div className="chat-bubble">{message.text}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto p-4 flex items-center gap-2">
            <textarea
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              className="input w-full"
            />

            <button className="btn btn-primary" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
