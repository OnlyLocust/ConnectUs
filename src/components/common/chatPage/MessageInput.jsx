import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessageToSocket } from "@/lib/socket";
import { addChat, removeChat } from "@/store/chatSlice";
import axios from "axios";
import { Paperclip, Send, Smile } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { API_URL } from "@/constants/constant";

const MessageInput = ({ recvId }) => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const comingSoon = useCallback(() => {
    toast.success("Feature coming soon");
  }, []);

  const sendMessage = async () => {
    dispatch(addChat({ message, isSender: true }));
    setMessage("");
    try {
      const res = await axios.post(
        `${API_URL}/chat/send/${recvId}`,
        { message },
        { withCredentials: true }
      );

      if (res.data.success) {
        sendMessageToSocket(recvId, message);
      } else {
        throw new Error("Message sending failed");
      }
    } catch (error) {
      dispatch(removeChat());
      toast.error(
        error.message || error.data.message || "Failed to send message"
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
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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
