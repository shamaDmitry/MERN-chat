import { MessagesSkeleton } from "@/components/skeletons/MessagesSkeleton";
import { Link, useParams } from "react-router-dom";
import { useChat } from "../store/useChat";
import { useEffect, useState } from "react";
import { ChevronLeft, Loader, User2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export const ChatPage = () => {
  const {
    getMessages,
    isLoadingMessages,
    sendMessage,
    messages,
    isMessageSending,
  } = useChat();
  const { user } = useAuthStore();
  const [message, setMessage] = useState("");
  const { userId } = useParams();

  useEffect(() => {
    getMessages(userId);
  }, [getMessages, userId]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    await sendMessage(userId, {
      text: message,
    });

    setMessage("");
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
        <div className="flex-1 flex flex-col relative">
          <div className="space-y-4">
            {messages.map((message) => {
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

          <div className="bg-primary-content sticky bottom-0 left-0 mt-auto p-4 flex items-center gap-2">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              className="input w-full"
            />

            <button
              disabled={isMessageSending}
              className="btn btn-primary w-24"
              onClick={handleSendMessage}
            >
              {isMessageSending ? (
                <Loader className="size-5 animate-spin" />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
