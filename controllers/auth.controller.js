const User = require('../models/user.model');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler.middleware');

// @desc Register user
//@route POST /api/v1/auth/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {

  const { name, email, password, role } = req.body;

  //Create user
  const user = await User.create({
    name, email, password, role,
  });

  //Create token
  const token = user.getSignedJWT();

  res.status(200).json({ success: true, message: "User created successfully", token });
})



// @desc Register user
//@route POST /api/v1/auth/register
//@access Public
exports.login = asyncHandler(async (req, res, next) => {

  const { email, password } = req.body;

  //Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400))
  }

  //Check for user
  //Create user
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ErrorResponse('Invalid credentials', 401))

  //Match password to hashed password
  const isMatch = await user.matchPassword(password);
  if(!isMatch) return next(new ErrorResponse('Invalid credentials',401));


  //Create token
  const token = user.getSignedJWT();

  res.status(200).json({ success: true, message: "Login successful", token });
})

