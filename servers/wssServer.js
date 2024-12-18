const WebSocket = require('ws');
const http = require('http');

const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());
const PORT = process.env.PORT || 3082;
console.log(`PORT: ${PORT}`);

// 創建HTTP伺服器
const server = http.createServer();
// 創建WebSocket伺服器
const wss = new WebSocket.Server({ server });

// 當有新的WebSocket連接時
wss.on('connection', (ws) => {
  console.log('Client connected');

  // 當接收到訊息時
  ws.on('message', (message) => {
    console.log('Received:', message);
    // 在這裡可以處理來自客戶端的訊息
    // ws3cx.send(message);
  });

  // 當連接關閉時
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // 發送訊息給客戶端
  ws.send('Welcome to the WebSocket server!');
});








// // 創建WebSocket客戶端連接到3CX
// const ws3cx = new WebSocket('wss://bonuc.3cx.com.tw/callcontrol/ws', {
//   headers: {
//     'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`, // 替換為您的Token
//   }
// });

// ws3cx.on('open', () => {
//   console.log('Connected to 3CX WebSocket');
// });

// ws3cx.on('message', (data) => {
//   console.log('Message from 3CX:', data);
//   // 將訊息轉發給前端客戶端
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(data);
//     }
//   });
// });

// ws3cx.on('close', () => {
//   console.log('Disconnected from 3CX WebSocket');
// });

// ws3cx.on('error', (error) => {
//   console.error('3CX WebSocket error:', error);
// });

// 啟動伺服器
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);