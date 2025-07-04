import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { setRecvId } from '@/store/chatSlice';
import { formatDistanceToNow } from 'date-fns';
import React from 'react'
import { useDispatch } from 'react-redux';
import Loader from './Loader';
import ShowAvatar from '../ShowAvatar';

const AllUsersChat = ({filteredChats , activeChat, setActiveChat, loading }) => {

  const dispatch = useDispatch()

  const setRecv = (id) => {
    dispatch(setRecvId(id))
  }
  

  return (

     loading ?(
          <div className="h-full w-full flex flex-1 justify-center items-center">
            <Loader/>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100%-110px)]">
          {filteredChats.map((chat) => (
            <div
              key={chat._id}
              className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-100 ${activeChat === chat._id ? 'bg-blue-50' : ''}`}
              onClick={() => {
                setActiveChat(chat._id);
                setRecv(chat.member._id)
                // Mark messages as read when opening chat
              }}
            >
              <div className="relative mr-3">
                <ShowAvatar profilePicture={chat.member.profilePicture} username={chat.member.username} size={12}/>
                {chat.member.online && (
                  <Badge className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{chat.member.username}</h3>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(chat.updatedAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage}
                </p>
              </div>
              {chat.notRead > 0 && (
                <Badge className="ml-2 bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {chat.notRead}
                </Badge>
              )}
            </div>
          ))}
        </ScrollArea>
        )

    
  )
}

export default AllUsersChat
