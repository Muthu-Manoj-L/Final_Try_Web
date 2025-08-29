const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ['https://spectraldataanalysis.netlify.app'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});