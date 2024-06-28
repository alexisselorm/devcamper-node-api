const Course = require('../models/course.model');
const Bootcamp = require('../models/bootcamp.model');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler.middleware');


//@desc Get courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
exports.getCourses = asyncHandler(async(req,res,next)=>{
  let query;

  if (req.params.bootcampId) {
    query = Course.find({bootcamp:req.params.bootcampId})
  }else{
    query = Course.find().populate({path:'bootcamp',select:'name description'});
  }
  const courses = await query
  res.status(200).json({success:true,count:courses.length,data:courses})
})


//@desc Get single course
//@route GET /api/v1/courses/:id
//@access public
exports.getCourse = asyncHandler(async(req,res,next)=>{
  const courses = await Course.findById(req.params.id).populate({path:'bootcamp',select:'name description'});

  if(!courses){
    return next(new ErrorResponse(`No course found with the id ${req.params.id}`));
  }

  res.status(200).json({success:true,count:courses.length,data:courses})
})


//@desc Create course
//@route [POST] /api/v1/bootcamps/:bootcampId/courses
//@access private
exports.createCourse = asyncHandler(async(req,res,next)=>{
  req.body.bootcamp = req.params.bootcampId

  let bootcamp = await Bootcamp.findById(req.params.bootcampId)
  
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp found with the id ${req.params.id}`))
  }

  const course = await Course.create(req.body);
  res.status(200).json({success:true,count:course.length,data:course})
})

