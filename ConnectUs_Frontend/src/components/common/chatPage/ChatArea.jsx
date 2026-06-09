"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { setChats } from "@/store/chatSlice";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Loader from "./Loader";
import { API_URL } from "@/constants/constant";

const ChatArea = ({ recvId, activeChat }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.chats);
  const typingUsers = useSelector((state) => state.chat.typingUsers || {});
  const isTyping = typingUsers[recvId];
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null); // 👈 ref for auto-scroll

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/chat/${recvId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setChats(res.data.messages));
        } else {
          throw new Error("Failed to fetch messages");
        }
      } catch (error) {
        toast.error(
          error.message || error.data.message || "Failed to fetch messages"
        );
      } finally {
        setLoading(false);
      }
    };

    const setNotRead = async () => {
      try {
        await axios.patch(`${API_URL}/chat/notread/${activeChat}`, {
          withCredentials: true,
        });
      } catch (error) {
        toast.error(
          error.message || error.data.message || "Failed to update read status"
        );
      }
    };

    getMessages();
    setNotRead();
  }, [recvId]);


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return loading ? (
    <Loader />
  ) : (
    <ScrollArea className="h-full px-4 py-2">
      <div className="space-y-4">
        {messages?.map((msg) => {
          const isPending = msg.optimisticId && !msg._id;
          return (
            <div
              key={msg._id || msg.optimisticId || msg.createdAt}
              className={`flex ${msg.isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 transition-opacity duration-300 ${
                  isPending ? "opacity-60" : "opacity-100"
                } ${
                  msg.isSender ? "bg-blue-500 text-white" : "bg-muted text-foreground"
                }`}
              >
                <p>{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.isSender ? "text-blue-100" : "text-muted-foreground"
                  }`}
                >
                  {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start items-center">
            <div className="bg-muted text-foreground rounded-lg px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatArea;
