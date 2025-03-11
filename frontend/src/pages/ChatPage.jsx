import { MessagesSkeleton } from "@/components/skeletons/MessagesSkeleton";
import { Link, useParams } from "react-router-dom";
import { useChat } from "@/store/useChat";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Image, Loader, Send, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import classNames from "classnames";
import { MessageItem } from "@/components/chat/MessageItem";
import toast from "react-hot-toast";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";

export const ChatPage = () => {
  const endContainerRef = useRef(null);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
    maxHeight: 150,
  });

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
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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
      image: imagePreview,
    });

    setMessage("");
    setImagePreview(null);
    adjustHeight(true);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("userIsTyping", {
      receiverId: userId,
      senderId: user._id,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
            <div className="space-y-4 mb-10" ref={endContainerRef}>
              {messages.length === 0 && (
                <p className="text-center">No messages yet</p>
              )}

              {messages.map((message) => {
                console.log("message", message);

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
              <div className="p-4">
                <div className="relative">
                  {isRemouteUserTyping && (
                    <div className="absolute bottom-0 right-0 mb-2 flex items-center justify-end gap-2 opacity-70">
                      <div
                        className={classNames(
                          "animate-pulse loading loading-dots size-4"
                        )}
                      />

                      <div className="text-xs font-medium">typing</div>
                    </div>
                  )}

                  {imagePreview && (
                    <div className="mb-3 flex items-center gap-2">
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 btn btn-secondary btn-circle"
                          type="button"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />

                  <textarea
                    ref={textareaRef}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => {
                      handleTyping(e);
                      adjustHeight();
                    }}
                    className="input w-full"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={classNames(
                        "btn btn-circle text-base-content/50",
                        {
                          "text-primary": imagePreview,
                        }
                      )}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image size={20} />
                    </button>

                    <button
                      disabled={isMessageSending}
                      className="btn btn-circle text-base-content/50"
                      onClick={handleSendMessage}
                    >
                      {isMessageSending ? (
                        <Loader className="size-5 animate-spin" />
                      ) : (
                        <Send size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
