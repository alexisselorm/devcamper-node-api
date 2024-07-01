const express = require('express')
const {register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.put('/update-details',protect, updateDetails)
router.put('/update-password',protect, updatePassword)
router.get('/me', protect, getMe)
router.post('/forgot-password', forgotPassword)
router.put('/resetPassword/:resettoken', resetPassword)

module.exports=router