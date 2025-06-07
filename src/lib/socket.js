import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();
import { store } from "@/store/store";
import { addChat } from "@/store/chatSlice";
import { setNotRead } from "@/store/authSlice";

let socket;

export const initiateSocket = (userId) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
      query: { userId },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("get", (data) => {
      const recv = store.getState().chat.recv;

      if (recv === data.userId) {
        store.dispatch(
          addChat({
            message: data.message,
            isSender: false,
            createdAt: data.createdAt,
          })
        );
      }
    });

    socket.on("notification" ,() => {
      store.dispatch(setNotRead({type:'inc'}))
    })
  }
};

export const sendMessageToSocket = (recvId, message) => {
  if (socket) {
    socket.emit("send", {
      recvId,
      message,
      createdAt: Date.now(),
    });
  } else {
    console.warn("❌ Socket not initialized");
  }
};

export const notify = (recvId) => {
   if (socket) {
    socket.emit("notify", {
      recvId
    });
  } else {
    console.warn("❌ Socket not initialized");
  }
}

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
