const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const hwRoutes = require('./routes/hwRoutes');
const path = require('path');

dotenv.config();



const app = express();

import cors from 'cors';

app.use(cors({
  origin: 'https://frontend-o8f1tfmsz-luise-tabatts-projects.vercel.app'
}));
app.use(express.json());


app.use('/api/hws', hwRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
})
.catch(err => console.error(err));
