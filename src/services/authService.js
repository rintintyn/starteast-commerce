const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'stareast-secret';
const TOKEN_EXPIRES_IN = '2h';

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const createToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN,
  });

const registerUser = ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw createError('Name, email, and password are required.', 400);
  }

  if (userModel.findByEmail(email)) {
    throw createError('Email already registered.', 409);
  }

  const user = userModel.addUser({ name, email, password });
  return {
    user: userModel.sanitizeUser(user),
    token: createToken(user),
  };
};

const loginUser = ({ email, password }) => {
  if (!email || !password) {
    throw createError('Email and password are required.', 400);
  }

  const user = userModel.findByEmail(email);

  if (!user || user.password !== password) {
    throw createError('Invalid email or password.', 401);
  }

  return {
    user: userModel.sanitizeUser(user),
    token: createToken(user),
  };
};

module.exports = {
  JWT_SECRET,
  registerUser,
  loginUser,
};
