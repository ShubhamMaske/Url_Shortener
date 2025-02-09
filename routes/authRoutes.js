const express = require('express');
const { loginSuccess, loginFailure } = require('../controllers/authController');
const passport = require('passport');
const router = express.Router();

router.post('/google-signin', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Callback route
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/failure' }),
    loginSuccess
  );
  
// Failure route
router.get('/failure', loginFailure);
  

module.exports = router;