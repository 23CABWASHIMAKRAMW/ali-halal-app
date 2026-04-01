const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Request logging middleware (moved to top)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: '*', // Temporarily allowing all origins for mobile debugging on local wifi
  credentials: true
}));
app.use(express.json());

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api', require('./routes/api'));

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Make io accessible in routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
