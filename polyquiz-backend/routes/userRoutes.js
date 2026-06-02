const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { updateScore, getLeaderboard, getUserProfile } = require('../controllers/userController');

router.get('/leaderboard', getLeaderboard);

router.post('/score', authMiddleware, updateScore);
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;