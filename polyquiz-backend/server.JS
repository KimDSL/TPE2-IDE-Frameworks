const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PolyQuiz API en ligne' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connecte a MongoDB');
  })
  .catch(err => {
    console.error('Erreur MongoDB:', err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur demarre sur http://localhost:${PORT}`);
});