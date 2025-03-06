import { MessagesSkeleton } from "@/components/skeletons/MessagesSkeleton";
import { Link, useParams } from "react-router-dom";
import { useChat } from "../store/useChat";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Loader, User2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import classNames from "classnames";

export const ChatPage = () => {
  const endContainerRef = useRef(null);

  const {
    getMessages,
    isLoadingMessages,
    sendMessage,
    messages,
    isMessageSending,
    subscribeToMessages,
    unSubscribeToMessages,
    setMessages,
  } = useChat();

  const { user, socket } = useAuthStore();

  const [message, setMessage] = useState("");
  const { userId } = useParams();
  const [isRemouteUserTyping, setIsRemouteUserTyping] = useState(false);

  useEffect(() => {
    getMessages(userId);

    return () => {
      setMessages([]);
    };
  }, [getMessages, setMessages, userId]);

  useEffect(() => {
    subscribeToMessages();

    return () => {
      unSubscribeToMessages();
    };
  }, [userId, subscribeToMessages, unSubscribeToMessages]);

  useEffect(() => {
    endContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("remoteUserIsTyping", ({ receiverId }) => {
      setIsRemouteUserTyping(true);
    });

    return () => {
      socket.off("remoteUserIsTyping");
    };
  }, [socket, userId]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    await sendMessage(userId, {
      text: message,
    });

    setMessage("");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("userIsTyping", {
      receiverId: userId,
      senderId: user._id,
    });
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
          <div className="space-y-4 mb-10">
            {messages.length === 0 && (
              <p className="text-center">No messages yet</p>
            )}

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
          <div ref={endContainerRef} />

          <div className="sticky bottom-0 left-0 mt-auto">
            {isRemouteUserTyping && (
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={classNames(
                    "animate-pulse loading loading-dots size-4"
                  )}
                />

                <div className="text-sm font-medium">is typing</div>
              </div>
            )}

            <div className="bg-primary-content  p-4 flex items-center gap-2">
              <textarea
                value={message}
                onChange={(e) => {
                  handleTyping(e);
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
        </div>
      )}
    </div>
  );
};
