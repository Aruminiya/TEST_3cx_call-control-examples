const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3081;


// 使用 CORS 中介軟體
app.use(cors());
app.use(express.json());

// 3CX callcontrol
app.get('/api/callcontrol', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${process.env.API_HOST}/callcontrol`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.AUTH_TOKEN}`, // 使用環境變數
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
  const { dnnumber } = req.params;
  const { reason, destination, timeout, attacheddata } = req.body;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${process.env.API_HOST}/callcontrol/${dnnumber}/makecall`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AUTH_TOKEN}`, // 替換為您的認證 token
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
  const { dnnumber, deviceid } = req.params;
  const { reason, destination, timeout, attacheddata } = req.body;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${process.env.API_HOST}/callcontrol/${dnnumber}/devices/${deviceid}/makecall`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AUTH_TOKEN}`, // 替換為您的認證 token
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});