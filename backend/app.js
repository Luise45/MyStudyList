const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const hwRoutes = require('./routes/hwRoutes');
const path = require('path');

dotenv.config();



const app = express();






app.use(cors({
  origin: 'https://frontend-o8f1tfmsz-luise-tabatts-projects.vercel.app'
}));
app.use(express.json());


app.use('/api/hws', hwRoutes);
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
})
