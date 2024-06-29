const User = require('../models/user.model');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler.middleware');

// @desc Register user
//@route GET /api/v1/auth/register
//@access Public
exports.register =asyncHandler(async(req,res,next)=>{

  const {name,email,password,role}=req.body;

  //Create user
  const user = await User.create({
    name,email,password,role,
  });

  res.status(200).json({success:true, message:"User created successfully"});
})

