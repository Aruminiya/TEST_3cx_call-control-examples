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
wss.on('connection', async (ws) => {
  console.log('Client connected');
  await connectTo3CX();
  // 當接收到訊息時
  ws.on('message', (message) => {
    console.log('Received:', message);
    // 在這裡可以處理來自客戶端的訊息
  });

  // // 當連接關閉時
  // ws.on('close', () => {
  //   console.log('Client disconnected');
  // });

  // // 發送訊息給客戶端
  // ws.send('Welcome to the proxy for 3CX WebSocket server!');
});

// 創建WebSocket客戶端連接到3CX
async function connectTo3CX() {
  const token = await token_3cx();
  const ws3cx = new WebSocket('wss://bonuc.3cx.com.tw/callcontrol/ws', {
    headers: {
      'Authorization': `Bearer ${token}`, // 替換為您的Token
    }
  });

  return new Promise((resolve, reject) => {
    ws3cx.on('open', () => {
      console.log('Connected to 3CX WebSocket');
      resolve(ws3cx);
    });

    ws3cx.on('message', (data) => {
      // console.log('Message from 3CX:', data);
      try {
        // 假設接收到的數據是JSON格式
        const parsedData = JSON.parse(data);
        console.log('Parsed Data from 3CX:', parsedData);

        // 將解析後的數據發送給所有連接的客戶端
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(parsedData)); // 確保發送的是字符串
          }
        });
      } catch (error) {
        console.error('Error parsing message from 3CX:', error);
      }
    });

    ws3cx.on('close', () => {
      console.log('Disconnected from 3CX WebSocket');
    });

    ws3cx.on('error', (error) => {
      console.error('3CX WebSocket error:', error);
      reject(error);
    });
  });
}

// 啟動伺服器
server.listen(WS_PORT, () => {
  console.log(`Server is listening on port ${WS_PORT}`);
});

console.log(`WebSocket server is running on ws://localhost:${WS_PORT}`);