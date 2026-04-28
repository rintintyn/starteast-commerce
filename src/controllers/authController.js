const authService = require('../services/authService');

const register = (req, res) => {
  try {
    const result = authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const login = (req, res) => {
  try {
    const result = authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
