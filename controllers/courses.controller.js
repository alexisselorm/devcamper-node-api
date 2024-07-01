const Course = require('../models/course.model');
const Bootcamp = require('../models/bootcamp.model');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler.middleware');


//@desc Get courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
exports.getCourses = asyncHandler(async(req,res,next)=>{

  if (req.params.bootcampId) {
   const  courses = await Course.find({bootcamp:req.params.bootcampId});
   return res.status(200).json({success:true,count:courses.length,data:courses});
  }else{
    res.status(200).json(res.advancedResults)
  }
 
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
  req.body.user= req.user.id;

  let bootcamp = await Bootcamp.findById(req.params.bootcampId);

   //Make sure user is bootcamp owner
   if (bootcamp.user.toString()!==req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to this bootcamp`,401))
    }
  
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp found with the id ${req.params.id}`))
  }

  const course = await Course.create(req.body);
  res.status(200).json({success:true,count:course.length,data:course})
})


//@desc Update course
//@route [PUT] /api/v1/courses/:id
//@access private
exports.updateCourse = asyncHandler(async(req,res,next)=>{
  
  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse(`No course found with the id ${req.params.id}`))
  }

   //Make sure user is courser owner
   if (course.user.toString()!==req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course`,401))
    }

  course = await Course.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  });
  res.status(200).json({success:true,data:course})
})


//@desc Update course
//@route [PUT] /api/v1/courses/:id
//@access private
exports.deleteCourse = asyncHandler(async(req,res,next)=>{
  
  const course = await Course.findById(req.params.id)

  
  if (!course) {
    return next(new ErrorResponse(`No course found with the id ${req.params.id}`))
  }

  if (course.user.toString()!==req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this course`,401))
    }

  await Course.deleteOne();
  res.status(200).json({success:true,data:{}})
})

