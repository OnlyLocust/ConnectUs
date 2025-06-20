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
  }, [messages]);

  return loading ? (
    <Loader />
  ) : (
    <ScrollArea className="h-full px-4 py-2">
      <div className="space-y-4">
        {messages?.map((msg) => (
          <div
            key={msg._id || msg.createdAt}
            className={`flex ${msg.isSender ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                msg.isSender ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              <p>{msg.message}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.isSender ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatArea;
