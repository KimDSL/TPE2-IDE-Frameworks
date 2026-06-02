// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Questions');

const questionsData = [
    {
        category: 'F1',
        text: 'Quelle est la premiere voiture de F1 a avoir utilise un moteur hybride ?',
        options: ['Mercedes W05', 'Ferrari SF70H', 'Red Bull RB9', 'McLaren MP4-28'],
        correctAnswer: 'Mercedes W05'
    },
    {
        category: 'Moto GP',
        text: 'Quel pilote de MotoGP a remporte le plus de titres mondiaux ?',
        options: ['Valentino Rossi', 'Giacomo Agostini', 'Marc Marquez', 'Jorge Lorenzo'],
        correctAnswer: 'Giacomo Agostini'
    },
    {
        category: 'NBA',
        text: 'Quel joueur de basket a remporte le plus de titres NBA ?',
        options: ['Michael Jordan', 'LeBron James', 'Kareem Abdul-Jabbar', 'Bill Russell'],
        correctAnswer: 'Michael Jordan'
    },
    {
        category: 'Manga',
        text: 'Quel est le manga le plus vendu de tous les temps ?',
        options: ['One Piece', 'Dragon Ball', 'Naruto', 'Attack on Titan'],
        correctAnswer: 'One Piece'
    },
    {
        category: 'Anime',
        text: 'Quel anime a remporte le prix du meilleur anime de l annee aux Crunchyroll Anime Awards 2021 ?',
        options: ['Jujutsu Kaisen', 'Attack on Titan', 'Demon Slayer', 'My Hero Academia'],
        correctAnswer: 'Jujutsu Kaisen'
    },
    {
        category: 'F1',
        text: 'Quel pilote de F1 a remporte le plus de titres mondiaux ?',
        options: ['Michael Schumacher', 'Lewis Hamilton', 'Ayrton Senna', 'Alain Prost'],
        correctAnswer: 'Michael Schumacher'
    },
    {
        category: 'Moto GP',
        text: 'Quel constructeur de MotoGP a remporte le plus de titres mondiaux ?',
        options: ['Honda', 'Yamaha', 'Ducati', 'Suzuki'],
        correctAnswer: 'Honda'
    },
    {
        category: 'NBA',
        text: 'Quel joueur de basket a marque le plus de points en carriere ?',
        options: ['Kareem Abdul-Jabbar', 'Karl Malone', 'LeBron James', 'Kobe Bryant'],
        correctAnswer: 'Kareem Abdul-Jabbar'
    },
    {
        category: 'Manga',
        text: 'Quel est le manga le plus long de tous les temps ?',
        options: ['One Piece', 'Dragon Ball', 'Naruto', 'Bleach'],
        correctAnswer: 'One Piece'
    },
    {
        category: 'Anime',
        text: 'Quel anime a remporte le prix du meilleur anime de l annee aux Crunchyroll Anime Awards 2020 ?',
        options: ['Demon Slayer', 'Mob Psycho 100', 'Attack on Titan', 'One Punch Man'],
        correctAnswer: 'Demon Slayer'
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connecte a MongoDB');

        await Question.deleteMany({});
        console.log('Anciennes questions supprimees');

        const inserted = await Question.insertMany(questionsData);
        console.log(inserted.length + ' questions inserees avec succes');

        console.log('Liste des questions :');
        inserted.forEach((q, i) => {
            console.log((i + 1) + '. [' + q.category + '] ' + q.text);
        });

        await mongoose.disconnect();
        console.log('Deconnecte');
        process.exit(0);
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
}

seedDatabase();