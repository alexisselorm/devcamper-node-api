const User = require('../models/user.model');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')



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
  const resetToken = await user.getResetToken();

  await user.save({
    validateBeforeSave:false,
  });
 

  //Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`

  const message=`You requested this password. Click here \n\n ${resetUrl}`
  try{

    await sendEmail({
      to:user.email,
      subject:'Password reset',
      message
    });
return res.status(200).json({success:true,data:'Email sent'})

  }
  catch(err){
    console.log(err);
    user.resetPasswordExpire=undefined;
    user.resetPasswordToken=undefined;
    await user.save({
      validateBeforeSave:false,
    });

    return next(new ErrorResponse('Email could not be sent',500))

  }
});


// @desc Reset password
//@route PUT /api/v1/auth/resetPassword:/resettoken
//@access Private
exports.resetPassword = asyncHandler(async(req,res,next) => {
  //Get hashed token
  const resetPasswordToken=crypto.createHash('sha256').update(req.params.resettoken).digest('hex');


  const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{
    $gt:Date.now()
  }});

  if (!user) {
    return next(new ErrorResponse('Invalid token',400))
  }
  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save();
 sendTokenResponse(user,200,res);

})