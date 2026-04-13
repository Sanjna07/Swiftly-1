require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('mark_leaving_soon', (data) => {
    console.log('User leaving soon:', data);
    socket.broadcast.emit('new_spot_available', data);
  });

  socket.on('reserve_spot', (data) => {
    console.log('Spot reserved:', data);
    io.emit('spot_reserved', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// 🔥 REPLACE WITH YOUR ACTUAL LINK
 mongoose.connect("mongodb+srv://admin:admin123@cluster.hao7ajf.mongodb.net/?appName=Cluster")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send("API Running");
});

const authRoutes = require('./routes/auth');
const parkingRoutes = require('./routes/parkingroutes');

app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});