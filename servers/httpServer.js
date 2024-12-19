const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const token_3cx = require('../utils/getToken');

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3081;


// 使用 CORS 中介軟體
app.use(cors());
app.use(express.json());

// 3CX callcontrol
app.get('/api/callcontrol', async (req, res) => {
  const token = await token_3cx();
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${process.env.API_HOST}/callcontrol`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // 使用環境變數
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data from 3CX API' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from 3CX API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3CX makecall
app.post('/api/callcontrol/:dnnumber/makecall', async (req, res) => {
  const token = await token_3cx();
  const { dnnumber } = req.params;
  const { reason, destination, timeout, attacheddata } = req.body;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${process.env.API_HOST}/callcontrol/${dnnumber}/makecall`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // 替換為您的認證 token
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason,
        destination,
        timeout,
        attacheddata
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to initiate call via 3CX API' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3CX makecall with deviceId
app.post('/api/callcontrol/:dnnumber/devices/:deviceid/makecall', async (req, res) => {
  const token = await token_3cx();
  const { dnnumber, deviceid } = req.params;
  const { reason, destination, timeout, attacheddata } = req.body;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${process.env.API_HOST}/callcontrol/${dnnumber}/devices/${deviceid}/makecall`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // 替換為您的認證 token
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason,
        destination,
        timeout,
        attacheddata
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to initiate call via 3CX API' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(HTTP_PORT, () => {
  console.log(`Server is running on http://localhost:${HTTP_PORT}`);
});