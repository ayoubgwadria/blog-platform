const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const tokenDenylist = new Set();

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token || tokenDenylist.has(token)) {
        return res.status(401).json({ message: 'Accès non autorisé' });
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(403).json({ message: 'Permissions insuffisantes' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token invalide' });
    }
  };
};

const addToDenylist = (token) => tokenDenylist.add(token);

module.exports = { authMiddleware, addToDenylist };