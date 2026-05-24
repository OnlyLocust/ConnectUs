import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import User from './src/models/user.model.js'
import Chat from './src/models/chat.model.js'

dotenv.config()

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Helper to find followers, followed users, and active chat partners
async function getPresenceSubscribers(userId) {
  try {
    const user = await User.findById(userId).select('followers following');
    const followers = user && user.followers ? user.followers.map(f => f.toString()) : [];
    const following = user && user.following ? user.following.map(f => f.toString()) : [];
    
    const chats = await Chat.find({ members: userId }).select('members');
    const chatPartners = chats.flatMap(chat => 
      chat.members.map(m => m.toString()).filter(m => m !== userId)
    );
    
    return Array.from(new Set([...followers, ...following, ...chatPartners]));
  } catch (error) {
    console.error('Error fetching presence subscribers:', error);
    return [];
  }
}

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
    pingInterval: 10000,
    pingTimeout: 5000,
  })
  global.io = io;

  io.on('connection', async (socket) => {
    const { userId } = socket.handshake.query;
    if (!userId) return;

    socket.join(userId);
    const userSocket = socket.id;

    // Track active sockets in a Set per user ID
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    const userSockets = onlineUsers.get(userId);
    userSockets.add(socket.id);

    // If first tab connecting, user transitions to Online
    if (userSockets.size === 1) {
      try {
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      } catch (err) {
        console.error("Error updating user lastSeen on connect:", err);
      }
      
      const subscribers = await getPresenceSubscribers(userId);
      subscribers.forEach((subId) => {
        io.to(subId).emit('user-online', { userId });
      });
    }

    socket.on('send' , (data) => {
      const {recvId , message , createdAt} = data
      io.to(recvId).emit('get', {userId, message ,createdAt})
    })

    socket.on('get-users', async () => {
      const subscribers = await getPresenceSubscribers(userId);
      const onlineSubscribers = subscribers.filter((subId) => onlineUsers.has(subId));
      io.to(userSocket).emit('online-users' ,{onlineUsers:onlineSubscribers})
    })

    socket.on('typing', (data) => {
      const { recvId, isTyping } = data;
      io.to(recvId).emit('user-typing', { userId, isTyping });
    });

    socket.on('notify' , (data) => {
      const {recvId} = data
      io.to(recvId).emit('notification', {})
    })

    socket.on('disconnect', async () => {
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        
        // If no active sockets remain, the user goes Offline
        if (userSockets.size === 0) {
          const lastSeen = new Date();
          try {
            await User.findByIdAndUpdate(userId, { lastSeen });
          } catch (err) {
            console.error("Error updating user lastSeen on disconnect:", err);
          }
          
          const subscribers = await getPresenceSubscribers(userId);
          subscribers.forEach((subId) => {
            io.to(subId).emit('user-offline', { userId, lastSeen });
          });
          
          onlineUsers.delete(userId);
        }
      }
    })

  })

  console.log(`🚀 Server listening on port : ${port} (${dev ? 'development' : 'production'})`)
})
