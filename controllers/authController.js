const generateToken = require('../utils/generateToken');

exports.loginSuccess = (req, res) => {
  try {
    const token = generateToken(req.user._id);
    res.json({
        message: 'Authentication successful',
        token,
        user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        createdAt: new Date(),
        },
    });
  } catch (error) {
    console.log("loginSuccess error - ",error)
    res.status(500).json({ message: 'Error redirecting URL', error });
  }
};

exports.loginFailure = (req, res) => {
  res.status(401).json({ message: 'Authentication failed' });
};
