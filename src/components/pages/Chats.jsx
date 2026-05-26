"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import SearchBox from "../common/chatPage/Search";
import AllUsersChat from "../common/chatPage/AllUsersChat";
import MessageInput from "../common/chatPage/MessageInput";
import ChatHeader from "../common/chatPage/ChatHeader";
import ChatArea from "../common/chatPage/ChatArea";
import NoChat from "../common/chatPage/NoChat";

import { setUserChats } from "@/store/chatSlice";
import { askOnline } from "@/lib/socket";
import { API_URL } from "@/constants/constant";
import { setIsHide } from "@/store/uiSlice";
import { usePathname } from "next/navigation";
import { joinChatRoom, leaveChatRoom } from "@/lib/socket";

export default function MessagesPage() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const chatUsers = useSelector((state) => state.chat.chatUsers);
  const recvId = useSelector((state) => state.chat.recv);

  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileChatView, setIsMobileChatView] = useState(false);

  useEffect(() => {
    if (activeChat) {
      joinChatRoom(activeChat);
      return () => {
        leaveChatRoom(activeChat);
      };
    }
  }, [activeChat]);

  const filteredChats = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return chatUsers;
    return chatUsers.filter((chat) =>
      chat.member.username.toLowerCase().includes(term)
    );
  }, [chatUsers, searchTerm]);

  useEffect(() => {
    return () => {
      dispatch(setIsHide(false));
    };
  }, [pathname, dispatch]);

  useEffect(() => {
    dispatch(setIsHide(false));
    const getChatUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/chat/chatusers`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUserChats(res.data.chatUsers));
        } else {
          throw new Error(res.data.message || "Failed to fetch chat users");
        }
      } catch (error) {
        toast.error(
          error.message ||
            error.data?.message ||
            "Failed to fetch all users for chat"
        );
      } finally {
        askOnline();
        setLoading(false);
      }
    };
    getChatUsers();
  }, [dispatch]);

  useEffect(() => {
    dispatch(setIsHide(isMobileChatView));
  }, [isMobileChatView, dispatch]);

  const setViewHam = (isChatView) => {
    setIsMobileChatView(isChatView);
  };

  return (
    <div className="flex h-[calc(100dvh-1rem)] sm:h-[calc(100dvh-2rem)] border rounded-lg overflow-hidden max-w-full mx-1 sm:mx-2">
      <div
        className={`w-full md:w-1/3 min-h-0 flex flex-col border-r bg-muted/30 shrink-0 ${
          isMobileChatView ? "hidden md:flex" : "flex"
        }`}
      >
        <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <AllUsersChat
          filteredChats={filteredChats}
          activeChat={activeChat}
          setActiveChat={(chatId) => {
            setActiveChat(chatId);
            if (window.innerWidth < 768) {
              setViewHam(true);
            }
          }}
          loading={loading}
        />
      </div>

      <div
        className={`flex flex-col flex-1 min-h-0 min-w-0 bg-background ${
          isMobileChatView ? "flex" : "hidden md:flex"
        }`}
      >
        {activeChat ? (
          <>
            <ChatHeader
              activeChat={activeChat}
              chatUsers={chatUsers}
              onBack={() => setViewHam(false)}
            />
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatArea recvId={recvId} activeChat={activeChat} />
            </div>
            <MessageInput recvId={recvId} />
          </>
        ) : (
          <NoChat />
        )}
      </div>
    </div>
  );
}
