import { Server } from 'socket.io';

export default function handleMessage(server) {
    console.log('test');
    const io = new Server(server, {
      cors: {
        credentials: true,
        origin: ['http://localhost:5173', 'http://localhost:5174'], 
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
    });
  
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  
      // Khi client tham gia vào cuộc trò chuyện
      socket.on('join-conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
      });
  
      // Khi client gửi tin nhắn
      socket.on('send-message', ({ conversationId, message }) => {
        console.log(`Message from ${socket.id}: ${message.text}`);
        socket.to(conversationId).emit('receive-message', message);
      });
  
      // Khi client ngắt kết nối
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
