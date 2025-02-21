const User = require("../models/User");
const { generateTokens, verifyToken } = require("../config/jwt");
const { addToDenylist } = require("../middleware/auth.js");


exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const user = await User.create({ email, password, role });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(tokens);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = verifyToken(refreshToken, true);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Refresh token invalide" });
    }

    const newTokens = generateTokens(user);
    addToDenylist(refreshToken);
    user.refreshToken = newTokens.refreshToken;
    await user.save();

    res.json(newTokens);
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

exports.logout = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  addToDenylist(token);
  res.json({ message: "Déconnexion réussie" });
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

