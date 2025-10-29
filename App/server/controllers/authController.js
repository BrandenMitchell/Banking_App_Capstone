//handles registration , login, logout, Token refresh

const User = require('../models/User');
const RefreshToken = require('../models/refreshToken');
const tokenService = require('../services/tokenService');
const crypto= require('crypto');

const registerUser = async (req, res) => {
    const { fullName, username, email, password, phoneNumber, street, city, zip, state } = req.body;
    if (!fullName || !username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already registered' });

    const newUser = await User.create({
        fullName,
        username,
        email,
        password,
        phoneNumber,
        address: { street, city, zip, state }
    });

    const accessToken = tokenService.signAccessToken(newUser);
    const refreshToken = tokenService.signRefreshToken(newUser);

    // Store the refresh token in DB (hashed)
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await RefreshToken.create({
        tokenHash,
        user: newUser._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        accessToken,
        refreshToken
    });
};
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.sub).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ valid: true, user });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const loginUser = async (req, res) => {
    const { identifier, password } = req.body;
    if ((!identifier) || !password)
        return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) return res.status(401).json({ message: 'Incorrect password' });

    const accessToken = tokenService.signAccessToken(user);
    const refreshToken = tokenService.signRefreshToken(user);

    // Store refresh token
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await RefreshToken.create({
        tokenHash,
        user: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken,
        refreshToken
    });
};



const refreshTokens = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
    }

    // Verify JWT signature
    const decoded = tokenService.verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Find the stored refresh token
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const storedToken = await RefreshToken.findOne({ tokenHash, revoked: false });

    if (!storedToken) {
        return res.status(403).json({ message: 'Refresh token not found or revoked' });
    }

    // Check expiration
    if (storedToken.isExpired()) {
        return res.status(403).json({ message: 'Refresh token expired' });
    }

    // Get the user
    const user = await User.findById(storedToken.user);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Issue new tokens
    const newAccessToken = tokenService.signAccessToken(user);
    const newRefreshToken = tokenService.signRefreshToken(user);

    // Invalidate old refresh token (optional rotation)
    storedToken.revoked = true;
    await storedToken.save();

    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    await RefreshToken.create({
        tokenHash: newTokenHash,
        user: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    });
};


module.exports = { registerUser, loginUser, refreshTokens, verifyToken };



