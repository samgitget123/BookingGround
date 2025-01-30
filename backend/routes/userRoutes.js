const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { phone_number } = req.body;
  try {
    let user = await User.findOne({ phone_number });
    if (!user) {
      user = new User({ phone_number });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    await user.save();

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error in sending OTP' });
  }
});

module.exports = router;  // Ensure the router is exported


// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phone_number, otp } = req.body;
  try {
    const user = await User.findOne({ phone_number, otp });
    if (!user) {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }

    user.is_verified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error in verifying OTP.'});
}
});