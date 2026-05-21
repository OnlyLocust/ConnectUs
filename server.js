import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'

dotenv.config()

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  await connectDB()
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port)


  let onlineUsers = new Map();
  global.onlineUsers = onlineUsers;

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })
  global.io = io;

  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;
    if (userId) {
      socket.join(userId);
    }
    const userSocket = socket.id
    onlineUsers.set(userId, socket.id);

    io.emit('user-online', {userId})

    socket.on('send' , (data) => {
      const {recvId , message , createdAt} = data
      io.to(recvId).emit('get', {userId, message ,createdAt})
    })

    socket.on('get-users',() => {

      const onlineUserSet = Array.from(onlineUsers.keys())

      io.to(userSocket).emit('online-users' ,{onlineUsers:onlineUserSet})
    })

    socket.on('notify' , (data) => {
      const {recvId} = data
      io.to(recvId).emit('notification', {})
    })

    socket.on('disconnect', () => {
      
      io.emit("user-offline" , {userId})
      onlineUsers.delete(userId);
      
      
      // for (let [userId, sId] of onlineUsers.entries()) {
      //   if (sId === socket.id) {
      //     onlineUsers.delete(userId);
      //     break;
      //   }
      // }
    })

  })

  console.log(`🚀 Server listening on port : ${port} (${dev ? 'development' : 'production'})`)
})
