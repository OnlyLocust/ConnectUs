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


  let users = []

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;
    users[userId] = socket.id

    socket.on('send' , (data) => {
      const {recvId , message , createdAt} = data
      const recvSocket = users[recvId]
      

      if(recvSocket){
        io.to(recvSocket).emit('get', {userId, message ,createdAt})
      }
      
    })

    socket.on('notify' , (data) => {
      const {recvId} = data
      const recvSocket = users[recvId]

      if(recvSocket){
        io.to(recvSocket).emit('notification', {})
      }

    })

    socket.on('disconnect', () => {
      
      for (const id in users) {
        if (users[id] === socket.id) {
          console.log(`🔴 ${id} disconnected`);
          delete users[id];
          break;
        }
      }
    })

  })

  console.log(`🚀 Server listening on port : ${port} (${dev ? 'development' : 'production'})`)
})
