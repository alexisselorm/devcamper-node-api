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
  sendTokenResponse(user,200,res);
})


//Get token from model, create cookie and send response
const sendTokenResponse = (user,statusCode,res) => {

  
  //Create token
  const token = user.getSignedJWT();


  //Create cookie
  const options={
    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
    httpOnly: true
  };

  if(process.env.NODE_ENV =='production') options.secure=true;

  res.status(statusCode).cookie('token',token,options).json({ success: true, token})

}




// @desc Get logged in user details
//@route GET /api/v1/auth/register
//@access Private
exports.getMe = asyncHandler(async(req,res,next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({ sucess:true,data: user});

})


// @desc Forgot Password
//@route GET /api/v1/auth/register
//@access Private
exports.forgotPassword = asyncHandler(async(req,res,next) => {
  const user = await User.findOne({email:req.body.email});

  if (!user) {
    return next(new ErrorResponse('No user with that email',404))
  }

  //Get reset token
  const resetToken = user.getResetToken();
  console.log(resetToken);

  await user.save({
    validateBeforeSave:false,
  });

  res.status(200).json({ sucess:true,data: user});

})