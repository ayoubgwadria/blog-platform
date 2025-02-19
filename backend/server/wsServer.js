const http = require('http');
const socketIo = require('socket.io');
const { setupCommentNamespace } = require('../sockets/comments');

const wsServer = http.createServer();
const io = socketIo(wsServer, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

const commentNamespace = io.of('/comments');
setupCommentNamespace(commentNamespace);

const PORT = 3001;
wsServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

module.exports = io;