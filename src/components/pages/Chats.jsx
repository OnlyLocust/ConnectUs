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

export default function MessagesPage() {
  const dispatch = useDispatch();
  const chatUsers = useSelector((state) => state.chat.chatUsers);
  const recvId = useSelector((state) => state.chat.recv);

  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileChatView, setIsMobileChatView] = useState(false);

  const filteredChats = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return chatUsers;
    return chatUsers.filter((chat) =>
      chat.member.username.toLowerCase().includes(term)
    );
  }, [chatUsers, searchTerm]);

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
  }, []);

  useEffect(() => {
    dispatch(setIsHide(isMobileChatView));
  },[isMobileChatView])

  const setViewHam = (isChatView, hideHam) => {
    setIsMobileChatView(isChatView);
    // dispatch(setIsHide(hideHam));
  };

  return (
    <div className="flex h-screen border rounded-lg overflow-hidden">

      <div
        className={`w-full md:w-1/3 border-r bg-gray-50 ${
          isMobileChatView ? "hidden md:block" : "block"
        }`}
      >
        <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <AllUsersChat
          filteredChats={filteredChats}
          activeChat={activeChat}
          setActiveChat={(chatId) => {
            setActiveChat(chatId);
            if (window.innerWidth < 768) {
              setViewHam(true, true);  
            }
          }}
          loading={loading}
        />
      </div>


      <div
        className={`flex-col w-full md:w-2/3 bg-white h-full ${
          isMobileChatView ? "flex" : "hidden md:flex"
        }`}
      >
        {activeChat ? (
          <>
            <ChatHeader
              activeChat={activeChat}
              chatUsers={chatUsers}
              onBack={() => setViewHam(false, false)} 
            />
            <div className="flex-1 overflow-hidden">
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
