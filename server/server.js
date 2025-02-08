// server/server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    //origin: "http://localhost:5173",
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');

//app.use(cors());
app.use(cors({
  origin: '*'
}));
app.use(express.json());

//mongoose.connect('mongodb://0.0.0.0:27017/chat_app', {
mongoose.connect('mongodb://mongodb:27017/chat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (data) => {
    socket.join(data.userId);
    console.log(`${data.isVendor ? 'Vendor' : 'User'} ${data.userId} joined`);
  });

  socket.on('send_message', async (data) => {
    try {
      const message = new Message({
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        isVendor: data.isVendor
      });
      await message.save();
      
      io.to(data.receiverId).emit('receive_message', {
        senderId: data.senderId,
        content: data.content,
        timestamp: message.timestamp,
        isVendor: data.isVendor
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/api/contacts/:userId/:isVendor', async (req, res) => {
  try {
    const { userId, isVendor } = req.params;
    const isVendorBool = isVendor === 'true';
    
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ timestamp: -1 });

    const contacts = new Set();
    messages.forEach(msg => {
      if (msg.senderId === userId) {
        contacts.add(msg.receiverId);
      } else {
        contacts.add(msg.senderId);
      }
    });

    res.json(Array.from(contacts));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});

app.get('/api/messages/:userId/:contactId', async (req, res) => {
  try {
    const { userId, contactId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

