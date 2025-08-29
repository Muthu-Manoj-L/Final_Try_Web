const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

// Debug log for MONGO_URI
console.log('MONGO_URI:', process.env.MONGO_URI);

const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ['https://spectraldataanalysis.netlify.app'],
  credentials: true
}));

// Handle preflight requests for all routes
app.options('*', cors({
  origin: ['https://spectraldataanalysis.netlify.app'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
console.log('MONGO_URI:', process.env.MONGO_URI);
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