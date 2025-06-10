import React from 'react'
import ShowAvatar from '../ShowAvatar'

const SuggestUser = ({profilePicture,username,isUser}) => {
  return (
       <>
        <div className="flex items-center gap-3">
          <ShowAvatar profilePicture={profilePicture} username={username} isUser={isUser} size={12}/>
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
