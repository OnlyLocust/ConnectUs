'use client'
import PostCard from '@/components/common/PostCard';
import { removeRecvPost, setRecvOnePost } from '@/store/recvSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import dotenv from 'dotenv'
dotenv.config()
const API_URL = process.env.API_URL

const page = ({params}) => {

  const recvPost = useSelector((state) => state.recv.recvPost);
  const dispatch = useDispatch()

    useEffect(() => {
        const getPost = async () => {
          try {
            const { id: postId } = await params;
    
            const res = await axios.get(`${API_URL}/post/${postId}`, {
              withCredentials: true,
            });
    
            if (res.data.success) {
              dispatch(setRecvOnePost(res.data.post))
              
            } else {
              throw new Error(res.data.message || "Failed to fetch this post");
            }
          } catch (error) {

            toast.error(
              error.response?.data?.message ||
                error.message ||
                "Failed to fetch this post"
            );
          }
        };
        getPost()

        return () => dispatch(removeRecvPost())
      }, []);

  return (
    <div className='h-screen'>
      {recvPost && (<PostCard post={recvPost} type='single'/>)}
    </div>
  )
}


export default page
