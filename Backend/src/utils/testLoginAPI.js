// testLoginAPI.js - Script để test API login
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/admin/login';

async function testLogin() {
  try {
    console.log('🧪 Testing Admin Login API...');
    console.log('URL:', API_URL);
    console.log('Email: admin@tndgranite.com');
    console.log('Password: admin123');
    console.log('');

    const response = await axios.post(API_URL, {
      email: 'admin@tndgranite.com',
      password: 'admin123'
    });

    console.log('✅ Login thành công!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('');
    console.log('Token:', response.data.data?.token?.substring(0, 50) + '...');
  } catch (error) {
    if (error.response) {
      console.error('❌ Lỗi từ server:');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('❌ Không nhận được response từ server');
      console.error('Có thể server chưa chạy. Hãy chạy: npm run dev');
    } else {
      console.error('❌ Lỗi:', error.message);
    }
  }
}

testLogin();

