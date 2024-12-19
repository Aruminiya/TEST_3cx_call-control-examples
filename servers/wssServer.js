const WebSocket = require('ws');
const http = require('http');

const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const token_3cx = require('../utils/getToken');

dotenv.config();


// connectTo3CX()

app.use(cors());
const WS_PORT = process.env.WS_PORT || 3082;

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
    // 將訊息發送回客戶端
    ws.send(`Echo 訊息發送回客戶端: ${message}`);
  });

  // 當連接關閉時
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // 發送訊息給客戶端
  ws.send('Welcome to the WebSocket server!');
});








// 創建WebSocket客戶端連接到3CX
// const token = await token_3cx();
// const ws3cx = new WebSocket('wss://bonuc.3cx.com.tw/callcontrol/ws', {
//   headers: {
//     'Authorization': `Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImpWbHdJWXlNRmoxMk5HNXFaZU1qUWciLCJ0eXAiOiJKV1QifQ.eyJ1bmlxdWVfbmFtZSI6InZpY3RvciIsImp0aSI6IjMyNWQ1YTNlLTY0YTktNDYwNi1hYmNhLTU5YmJhZTlkYTZmNiIsInJvbGUiOlsiQXBwIiwiUmVwb3J0cyIsIlBob25lU3lzdGVtQWRtaW4iLCJHcm91cHMuQ3JlYXRlIiwiVXNlcnMiLCJUcnVua3MiLCJHbG9iYWxBZG1pbiIsIkFkbWluIiwiQXBwcy5SZWFkV3JpdGUiLCJNYWNoaW5lQWRtaW4iLCJTaW5nbGVDb21wYW55IiwiUGFpZCIsIkVudGVycHJpc2UiLCJDYWxsRmxvd0FwcCJdLCJNYXhSb2xlIjoic3lzdGVtX293bmVycyIsIm5iZiI6MTczNDU5OTI3MywiZXhwIjoxNzM0NjAyODczLCJpYXQiOjE3MzQ1OTkyNzMsImlzcyI6ImJvbnVjLjNjeC5jb20udHciLCJhdWQiOiIvYXBpIn0.WwKnlQ8puS-jO5ikm6_wu9TqUlQ7tSTId2XDJApeb7NWaf4iqAPGUoI-SGmHiIxgUuu1dOvzSBiQbaij30ZdbA`, // 替換為您的Token
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
server.listen(WS_PORT, () => {
  console.log(`Server is listening on port ${WS_PORT}`);
});

console.log(`WebSocket server is running on ws://localhost:${WS_PORT}`);