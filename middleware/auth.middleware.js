const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler.middleware')
const ErrorResponse = require('../utils/errorHandler')
const User = require('../models/user.model')


//Protect routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
   else if (req.cookies.token) {
    token = req.cookies.token
  }

  //Make sure token exists
  if(!token){
    return next(new ErrorResponse('Not Authorized to access this route',401))
  }

  //Verify token
  try{
    let decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded._id);

    next();
  }catch(e){
    return next(new ErrorResponse(e.message,500))
  }
})

//Grant access to specific roules
exports.authorize = (...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
    return next(new ErrorResponse(`User role ${req.user.role} is unauthorized to access this route`,403));
    }
    next();
  }
}