const User = require('../models/user.model');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler.middleware');


// @desc Get all users
//@route GET /api/v1/users
//@access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {

  res.status(200).json(res.advancedResults);
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({success:true,data:user});
});

// @desc Create user
//@route POST /api/v1/users
//@access Private
exports.createUser = asyncHandler(async (req, res, next) => {

  //Create user
  const user = await User.create(req.body);
  res.status(200).json({ success: true, message: "User created successfully",data:user });
})


// @desc Update user
//@route POST /api/v1/users
//@access Private
exports.updateUser = asyncHandler(async (req, res, next) => {

  //Create user
  const user = await User.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  });
  res.status(200).json({ success: true, message: "User update successfully",data:user });
})

// @desc Update user
//@route POST /api/v1/users
//@access Private
exports.deleteUser = asyncHandler(async (req, res, next) => {

  //Create user
   await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "User deleted successfully" });
})