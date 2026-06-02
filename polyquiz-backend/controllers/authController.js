const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, pseudo: user.pseudo },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );
};

const login = async (req, res) => {
    try {
        const { pseudo } = req.body;

        if (!pseudo || pseudo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Le pseudo est requis'
            });
        }

        const cleanPseudo = pseudo.trim().toLowerCase();

        if (cleanPseudo.includes(' ')) {
            return res.status(400).json({
                success: false,
                message: 'Le pseudo ne doit pas contenir d espaces'
            });
        }

        let user = await User.findOne({ pseudo: cleanPseudo });

        if (!user) {
            user = await User.create({
                pseudo: cleanPseudo,
                bestScore: 0
            });
            console.log('Nouvel utilisateur cree:', cleanPseudo);
        } else {
            console.log('Utilisateur existant:', cleanPseudo);
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: 'Authentification reussie',
            token,
            user: {
                id: user._id,
                pseudo: user.pseudo,
                bestScore: user.bestScore
            }
        });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

module.exports = { login };