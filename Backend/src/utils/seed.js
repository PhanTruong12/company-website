// seed.js - Script để chạy seed dữ liệu
require('dotenv').config();
const mongoose = require('mongoose');
const { seedAll } = require('./seedData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tndgranite';

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('Đã kết nối MongoDB');
  return seedAll();
})
.then(() => {
  console.log('Seed hoàn tất!');
  process.exit(0);
})
.catch((error) => {
  console.error('Lỗi:', error);
  process.exit(1);
});

