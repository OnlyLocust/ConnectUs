import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addChat, removeChat } from "@/store/chatSlice";
import axios from "axios";
import { Paperclip, Send, Smile } from "lucide-react";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { API_URL } from "@/constants/constant";
import { getSocket } from "@/lib/socket";

const MessageInput = ({ recvId }) => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const isTypingRef = useRef(false);
  const stopTypingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      // Clear typing indicator when switching chats or unmounting
      if (isTypingRef.current && recvId) {
        getSocket()?.emit("typing", { recvId, isTyping: false });
        isTypingRef.current = false;
      }
      if (stopTypingTimeoutRef.current) {
        clearTimeout(stopTypingTimeoutRef.current);
      }
    };
  }, [recvId]);

  const comingSoon = useCallback(() => {
    toast.success("Feature coming soon");
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setMessage(val);

    const socketInstance = getSocket();
    if (!socketInstance || !recvId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketInstance.emit("typing", { recvId, isTyping: true });
    }

    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }

    stopTypingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socketInstance.emit("typing", { recvId, isTyping: false });
    }, 3000);
  };

  const sendMessage = async () => {
    const text = message.trim();
    if (!text) return;

    // Reset typing indicator immediately
    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      getSocket()?.emit("typing", { recvId, isTyping: false });
    }

    const optimisticId = `opt-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    dispatch(addChat({ message: text, isSender: true, optimisticId }));
    setMessage("");
    try {
      const res = await axios.post(
        `${API_URL}/chat/send/${recvId}`,
        { message: text, optimisticId },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(
          addChat({
            _id: res.data.messageId,
            message: text,
            isSender: true,
            createdAt: res.data.createdAt,
            optimisticId,
          })
        );
      } else {
        throw new Error("Message sending failed");
      }
    } catch (error) {
      dispatch(removeChat({ optimisticId }));
      toast.error(
        error.message || error.response?.data?.message || "Failed to send message"
      );
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={comingSoon}>
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          type="text"
          placeholder="Type a message..."
          className="flex-1"
          value={message}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button variant="ghost" size="icon" onClick={comingSoon}>
          <Smile className="h-5 w-5" />
        </Button>
        <Button size="icon" onClick={sendMessage} disabled={!message.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
