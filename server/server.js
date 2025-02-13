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

mongoose.set('strictQuery', false); // Add this line

mongoose.connect('mongodb://mongodb:27017/chat_app', { // docker network
//mongoose.connect('mongodb://172.26.8.103:27017/chat_app', { // local pc
//mongoose.connect('mongodb://xxxxxx.cosmos.azure.com:10255/chat_app?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@xxxxxx@', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false,
  w: "majority",
  // ssl: true // Important for Cosmos DB
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection error:', err));

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
  // Store params outside try block so they're accessible in catch
  const { userId, isVendor } = req.params;  

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
    // Add detailed error logging
    console.error('Error in /api/contacts endpoint:');
    console.error('Error message:', error.message);
    console.error('Full error stack:', error.stack);
    console.error('Request parameters:', { userId, isVendor });

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

    // Add these lines to print messages to console
    //console.log('Messages between users:', userId, 'and', contactId);
    //console.log('Messages:', JSON.stringify(messages, null, 2));

    res.json(messages);

  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

