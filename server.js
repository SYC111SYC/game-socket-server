const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('玩家连接：', socket.id);

  // 加入房间
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit('playerJoin', socket.id);
  });

  // 游戏数据广播（位置、按键、状态）
  socket.on('gameData', (roomId, data) => {
    socket.to(roomId).emit('recvData', data);
  });

  // 玩家断开
  socket.on('disconnect', () => {
    console.log('玩家离开：', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('服务器启动成功');
});
