const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    //   console.log('Token received in middleware:', token);
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    if (token.length < 10) {
      return res.status(401).json({ message: 'Token is too short/invalid' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error('Error in protect middleware:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};


const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not Authorized as admin" });
  }
};

module.exports = { protect, admin };
