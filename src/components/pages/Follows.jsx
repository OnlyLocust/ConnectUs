"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { API_URL } from "@/constants/constant";
import { emptyFollow, setFollow } from "@/store/followSlice";
import axios from "axios";
import { Search} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ShowFollowsBox from "../common/ShowFollowsBox";

export default function FollowsPage({ id, followType }) {
  const follow = useSelector((state) => state.follow.follow) || [];
  const profile = useSelector((state) => state.follow.user);
  const {_id: userId } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Use useMemo for optimized filtering
  const filteredFollow = useMemo(() => {
    if (!searchQuery.trim()) return follow;
    
    return follow.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [follow, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const getFollow = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/${followType}/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(
            setFollow({
              followData: res.data.followData,
              userData: res.data.userData,
            })
          );
        } else {
          throw new Error(res.data.message || "Failed to fetch followers");
        }
      } catch (error) {

        toast.error(
          error.response?.data?.message || error.message || "Login failed"
        );
      }
    };
    getFollow();

    return () => dispatch(emptyFollow());
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="w-2/3 m-auto grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center justify-center">
              <Avatar className="h-10 w-10">
              <AvatarImage
                src={profile?.profilePicture}
                alt={profile?.username}
              />
              <AvatarFallback>
                {profile?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-semibold">
              {userId == id ? "Your" : `${profile?.username}'s`}{" "}
              {followType == "followers" ? "followers" : "following"}
            </h1>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search followers..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                 value={searchQuery}
          onChange={handleSearch}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {followType == "followers" ? (
                  <span>
                    Followers of {userId == id ? "You" : profile?.username} :{" "}
                    {follow.length} People
                  </span>
                ) : (
                  <span>
                     {userId == id ? "You" : profile?.username} Following : {" "}
                    {follow.length} People
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {filteredFollow.length > 0 ?
                    filteredFollow?.map((user, i) => (
                      <ShowFollowsBox user={user} key={i} userId={userId} />
                    )) : (
                    <TableRow className="text-center text-muted-foreground py-4"><TableCell>No User</TableCell></TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
