import { Button } from "@/components/ui/button";
import { setRecvId } from "@/store/chatSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import dotenv from 'dotenv'
dotenv.config()
const API_URL = process.env.API_URL

const SecondButton = ({ userId, id }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const startMessage = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/chat/addchat`,
        { recvId: id },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setRecvId(id));
        router.push("/home/chats");
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return userId == id ? (
    <Button variant="secondary" className="cursor-pointer">
      View Posts
    </Button>
  ) : (
    <Button
      variant="secondary"
      className="cursor-pointer"
      onClick={startMessage}
    >
      Message
    </Button>
  );
};

export default SecondButton;
