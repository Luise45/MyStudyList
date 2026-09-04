const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const hwRoutes = require('./routes/hwRoutes');
const healthRoutes = require('./routes/healthRoutes');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:5000',
  'https://mystudylist.vercel.app',
  'https://frontend-o8f1tfmsz-luise-tabatts-projects.vercel.app',
  ...(process.env.FRONTEND_URLS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
];

app.use(cors({
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  }
}));

app.use(express.json());

app.use('/api/hws', hwRoutes);
app.use('/health', healthRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  });