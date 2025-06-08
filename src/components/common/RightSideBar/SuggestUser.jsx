import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

const SuggestUser = ({profilePicture,username,isUser}) => {
  return (
       <>
        <div className="flex items-center gap-3">
          <Avatar className={`h-12 w-12 border-2 ${isUser && 'border-pink-500'}`}>
            <AvatarImage
              src={profilePicture || "#" }
              className="object-cover"
            />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold text-sm">{username}</p>
            <p className="text-xs text-gray-500">{isUser ? username : "Suggested for you"}</p>
          </div>
        </div>
        <button className="text-xs text-blue-500 font-semibold hover:text-blue-700 transition-colors">
          Profile
        </button>
       </>
  )
}

export default SuggestUser
