const { jwtDecode } = require('jwt-decode');
const dotenv = require('dotenv');

dotenv.config();

async function getToken() {
  try {
    const response = await fetch(`${process.env.BONVIES_API_HOST}/3cx/connect/token`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BONVIES_TOKEN}`,
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateToken() {
  try {
    const response = await fetch(`${process.env.BONVIES_API_HOST}/3cx/connect/token`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BONVIES_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log('data', data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


module.exports = async function token_3cx() {
  try {
    // 獲取當前的 token 資料
    const tokenData = await getToken();
    
    // 解碼 token 以獲取其過期時間
    const decoded = jwtDecode(tokenData.token);
    
    // 獲取當前時間（以秒為單位）
    const currentTime = Date.now() / 1000;

    // 檢查 token 是否已過期
    if (decoded.exp && decoded.exp < currentTime) {
      // 如果過期，更新 token
      await updateToken();
      
      // 獲取新的 token
      const newToken = await getToken();
      
      // 返回新的 token
      return newToken.token;
    }
    
    // 如果 token 未過期，返回當前的 token

    return tokenData.token;
  } catch (error) {
    // 捕獲並打印錯誤
    console.error(error);
    throw error;
  }
}
