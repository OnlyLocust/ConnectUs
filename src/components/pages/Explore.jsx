"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { ComingSoonBox } from '../common/ComingSoon';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // const trendingPosts = [
  //   {
  //     id: 1,
  //     username: 'traveler123',
  //     avatar: '/avatars/traveler.jpg',
  //     content: 'Just arrived in Bali! This place is magical 🌴 #travel #bali',
  //     likes: 1243,
  //     comments: 89,
  //     time: new Date('2023-05-20T14:30:00'),
  //   },
  //   {
  //     id: 2,
  //     username: 'foodie_guru',
  //     avatar: '/avatars/foodie.jpg',
  //     content: 'Made this delicious pasta from scratch today! Recipe in comments 👇',
  //     likes: 892,
  //     comments: 45,
  //     time: new Date('2023-05-21T09:15:00'),
  //   },
  // ];

  // const suggestedUsers = [
  //   {
  //     id: 1,
  //     username: 'photography_lover',
  //     avatar: '/avatars/photographer.jpg',
  //     bio: 'Street photography enthusiast | Nikon shooter',
  //     followers: 5421,
  //   },
  //   {
  //     id: 2,
  //     username: 'fitness_coach',
  //     avatar: '/avatars/coach.jpg',
  //     bio: 'Helping people transform their lives through fitness',
  //     followers: 12800,
  //   },
  // ];

  // const popularTags = [
  //   { name: '#travel', posts: 125000 },
  //   { name: '#food', posts: 98000 },
  //   { name: '#photography', posts: 75600 },
  //   { name: '#fitness', posts: 68200 },
  // ];

  const trendingPosts = [];
  const suggestedUsers = [];
  const popularTags = [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search posts, people, or tags..."
            className="pl-10 pr-4 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        {/* Trending Content */}
        <TabsContent value="trending" className="mt-6">
          <h2 className="text-2xl font-bold mb-6">Trending Posts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">@{post.username}</CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(post.time, { addSuffix: true })}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800">{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* People Content */}
        <TabsContent value="people" className="mt-6">
          <h2 className="text-2xl font-bold mb-6">Suggested People</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestedUsers.map((user) => (
              <Card key={user.id} className="text-center p-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">@{user.username}</CardTitle>
                <CardDescription className="mt-2 mb-4">{user.bio}</CardDescription>
                <div className="text-sm text-gray-500 mb-4">
                  {user.followers.toLocaleString()} followers
                </div>
                <Button variant="outline" className="w-full">
                  Follow
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tags Content */}
        <TabsContent value="tags" className="mt-6">
          <h2 className="text-2xl font-bold mb-6">Popular Tags</h2>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Button
                key={tag.name}
                variant="outline"
                className="rounded-full px-4 py-2 text-sm"
              >
                <span className="font-semibold">{tag.name}</span>
                <span className="ml-2 text-gray-500">
                  {tag.posts.toLocaleString()} posts
                </span>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <ComingSoonBox/>
    </div>
  );
}