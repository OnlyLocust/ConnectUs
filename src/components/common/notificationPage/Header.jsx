import { Button } from "@/components/ui/button";
import { API_URL } from "@/constants/constant";
import { setNotRead } from "@/store/authSlice";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const Header = () => {

  const dispatch = useDispatch()

  const setNotReadZero = async () => {
    try {
      const res = await axios.patch(`${API_URL}/notification/reset`, {
        withCredentials: true,
      });
      if (!res.data.success) {
        throw new Error("Failed to set zero ");
      }
    } catch (error) {
      toast.error(error.message || error.data.message || "failed zero");
    }
    dispatch(setNotRead({ type: "reset" }));
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={setNotReadZero}>Mark all as read</Button>
      </div>
    </div>
  );
};

export default React.memo(Header);
