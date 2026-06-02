const User = require('../models/User');

const updateScore = async (req, res) => {
  try {
    const { newScore } = req.body;
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouve' });
    }
    
    let recordBattu = false;
    
    if (newScore > user.bestScore) {
      user.bestScore = newScore;
      await user.save();
      recordBattu = true;
    }
    
    res.json({
      success: true,
      recordBattu,
      bestScore: user.bestScore
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select('pseudo bestScore')
      .sort({ bestScore: -1 })
      .limit(10);
    
    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { updateScore, getLeaderboard, getUserProfile };