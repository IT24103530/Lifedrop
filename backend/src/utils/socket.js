let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO]: Client connected -> ${socket.id}`);

    // Join user-specific notification room
    socket.on('join-user-room', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`[Socket.IO]: Socket ${socket.id} joined room -> user_${userId}`);
      }
    });

    socket.on('leave-user-room', (userId) => {
      if (userId) {
        socket.leave(`user_${userId}`);
        console.log(`[Socket.IO]: Socket ${socket.id} left room -> user_${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO]: Client disconnected -> ${socket.id}`);
    });
  });
};

const getIO = () => {
  return ioInstance;
};

const emitToUser = (userId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`user_${userId}`).emit(event, data);
  }
};

const broadcastEvent = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  broadcastEvent
};
