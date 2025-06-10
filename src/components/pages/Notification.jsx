"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, UserPlus, Heart, MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "@/store/notificationSlice";
import { toast } from "sonner";
import NoNotification from "../common/notificationPage/NoNotification";
import Settings from "../common/notificationPage/Settings";
import NotificationCard from "../common/notificationPage/NotificationCard";
import Header from "../common/notificationPage/Header";
import LoadingNotifications from "../common/notificationPage/LoadingNotifications";
import dotenv from 'dotenv'
dotenv.config()
const API_URL = process.env.API_URL

export default function NotificationsPage() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const notRead = useSelector((state) => state.auth.notRead);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/notification/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setNotifications(res.data.notifications));
        } else {
          throw new Error("Failed to fetch notifications");
        }
      } catch (error) {
        toast.error(
          error.message || error.data.message || "failed notification"
        );
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, []);

  const [activeTab, setActiveTab] = useState("all");

  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
  });

  const getNotificationIcon = useCallback((type) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "comment":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  }, []);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((n) => n.action === activeTab);
  }, [activeTab, notifications]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Header />

      <Tabs
        defaultValue="all"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="like">Likes</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
          <TabsTrigger value="follow">Follows</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <LoadingNotifications />
          ) : (
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification, i) => (
                  <div
                    key={notification._id}
                    className={`p-4 rounded-lg ${
                      i < notRead && activeTab === "all"
                        ? "bg-gray-100 border border-blue-100"
                        : "bg-white border"
                    }`}
                  >
                    <NotificationCard
                      getNotificationIcon={getNotificationIcon}
                      notification={notification}
                    />
                  </div>
                ))
              ) : (
                <NoNotification />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <Settings
        notificationSettings={notificationSettings}
        setNotificationSettings={setNotificationSettings}
      />
    </div>
  );
}
