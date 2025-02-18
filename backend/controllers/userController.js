const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    );
    
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    
    res.json({
      id: user._id,
      email: user.email,
      newRole: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};