// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Tuyến đường mẫu
app.get('/', (req, res) => {
  res.send('Chào mừng đến với API giới thiệu công ty!');
});

app.listen(port, () => {
  console.log(`Server đang chạy trên cổng: ${port}`);
});