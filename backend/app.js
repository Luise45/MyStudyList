const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const hwRoutes = require('./routes/hwRoutes');
const path = require('path');

dotenv.config();



const app = express();






app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  }
}));
app.use(express.json());


app.use('/api/hws', hwRoutes);
const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
})
