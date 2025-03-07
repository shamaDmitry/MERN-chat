import { MessagesSkeleton } from "@/components/skeletons/MessagesSkeleton";
import { Link, useParams } from "react-router-dom";
import { useChat } from "@/store/useChat";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Loader } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import classNames from "classnames";
import { MessageItem } from "@/components/chat/MessageItem";

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
    getReceiver,
    receiver,
    setReceiver,
  } = useChat();

  const { user, socket } = useAuthStore();

  const [message, setMessage] = useState("");
  const { userId } = useParams();
  const [isRemouteUserTyping, setIsRemouteUserTyping] = useState(false);

  useEffect(() => {
    getMessages(userId);
    getReceiver(userId);

    return () => {
      setMessages([]);
      setReceiver(null);
    };
  }, [getMessages, setMessages, userId, getReceiver, setReceiver]);

  useEffect(() => {
    subscribeToMessages();

    return () => {
      unSubscribeToMessages();
    };
  }, [userId, subscribeToMessages, unSubscribeToMessages]);

  useEffect(() => {
    endContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  useEffect(() => {
    socket.on("userIsTyping", ({ isTyping }) => {
      setIsRemouteUserTyping(isTyping);
    });

    socket.on("userIsStopTyping", ({ isTyping }) => {
      setIsRemouteUserTyping(isTyping);
    });

    return () => {};
  }, [socket]);

  useEffect(() => {
    let typingTimer;

    if (message) {
      typingTimer = setTimeout(() => {
        socket.emit("userIsStopTyping", {
          receiverId: userId,
          isTyping: false,
        });
      }, 2000);
    }
    return () => clearTimeout(typingTimer);
  }, [message, socket, userId]);

  return (
    <>
      <div>
        <Link to="/" className="gap-1.5 mb-4 btn btn-sm btn-primary">
          <ChevronLeft className="size-4" />

          <span className="capitalize">back</span>
        </Link>
      </div>

      <div className="flex flex-col min-h-full">
        {isLoadingMessages ? (
          <MessagesSkeleton count={4} className="w-full" />
        ) : (
          <div className="flex-1 flex flex-col relative">
            <div className="space-y-4 mb-10" ref={endContainerRef}>
              {messages.length === 0 && (
                <p className="text-center">No messages yet</p>
              )}

              {messages.map((message) => {
                return (
                  <MessageItem
                    key={message._id}
                    message={message}
                    receiver={receiver}
                  />
                );
              })}
            </div>

            <div className="mt-auto">
              {isRemouteUserTyping && (
                <div className="mb-2 flex items-center justify-end gap-2">
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
    </>
  );
};
