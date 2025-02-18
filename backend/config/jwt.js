require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};
const verifyToken = (token, isRefresh = false) => {
  return jwt.verify(
    token,
    isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET
  );
};

module.exports = { generateTokens, verifyToken };
