const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
console.log('Verification de la connexion...');
console.log('MONGODB_URI existe:', !!uri);

mongoose.connect(uri)
  .then(() => {
    console.log('Connecte a MongoDB Atlas avec succes');
    console.log('Base de donnees:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('ERREUR de connexion:', err.message);
    console.log('Verifiez:');
    console.log('   1. Votre mot de passe dans .env');
    console.log('   2. L URL complete sans espaces');
    console.log('   3. Que l IP est autorisee (0.0.0.0/0) dans Atlas');
  });

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PolyQuiz API en ligne' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur demarre sur http://localhost:${PORT}`);
});