const http = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { initSocket } = require('./utils/socket');

// Load environment variables
dotenv.config();

// Dynamic CORS checker for localhost origins (3000, 3001, 5173, etc.)
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
};

// Initialize Express app & HTTP Server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }
});
initSocket(io);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback allow localhost
      }
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

// Connect to Database
connectDB();

// Feature Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const requestRoutes = require('./routes/requestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const donorRoutes = require('./features/donor-registration/donorRoutes');
const donorBrowseRoutes = require('./features/donor-browse/donorBrowseRoutes');

// API Endpoints Mapping
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'LifeDrop API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/donors', donorBrowseRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred',
    error: err.message
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[LifeDrop Server]: Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode with Socket.IO`);
});
