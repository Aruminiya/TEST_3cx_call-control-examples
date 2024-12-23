const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const token_3cx = require('../utils/getToken');

dotenv.config();

app.use(cors());
const WS_PORT = process.env.WS_PORT || 3082;

// 創建HTTP伺服器
const server = http.createServer();
// 創建WebSocket伺服器
const wss = new WebSocket.Server({ server });

// 當有新的WebSocket連接時
wss.on('connection', async (ws) => {
  console.log('Client connected');
  const ws3cx = await connectTo3CX();
  
  // 當接收到訊息時
  ws.on('message', async (message) => {
    // 動態引入 SIP 模組
    const SIP = await import('sip.js');
    ws3cx.send(message);
    // // 解析 SIP 消息
    // const sipMessage = SIP.Parser.parseMessage(message);
    // // 處理 SIP 消息
    // handleSipMessage(sipMessage);
  });
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
      try {
        const parsedData = JSON.parse(data);
        console.log('Parsed Data from 3CX:', parsedData);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(parsedData));
          }
        });
      } catch (error) {
        console.error('Error parsing message from 3CX:', error);
      }
    });

    ws3cx.on('close', (data) => {
      console.log('Disconnected from 3CX WebSocket');
      console.log(data);
    });

    ws3cx.on('error', (error) => {
      console.error('3CX WebSocket error:', error);
      reject(error);
    });
  });
}

// function handleSipMessage(sipMessage) {
//   console.log('接收sip訊息');
//   console.log('Received SIP message:', sipMessage);
//   // 這裡可以添加轉發或其他處理邏輯
// }

// 啟動伺服器
server.listen(WS_PORT, () => {
  console.log(`Server is listening on port ${WS_PORT}`);
});

console.log(`WebSocket server is running on ws://localhost:${WS_PORT}`);