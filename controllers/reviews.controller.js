const Course = require('../models/course.model');
const Bootcamp = require('../models/bootcamp.model');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const Review = require('../models/review.model');


//@desc Get reviews
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
exports.getReviews = asyncHandler(async(req,res,next)=>{

  if (req.params.bootcampId) {
   const  reviews = await Review.find({bootcamp:req.params.bootcampId});
   return res.status(200).json({success:true,count:reviews.length,data:reviews});
  }else{
    res.status(200).json(res.advancedResults)
  }
 
})


//@desc Get single review
//@route GET /api/v1/reviews/:id
//@access public
exports.getReview = asyncHandler(async(req,res,next)=>{

   const  review = await Review.findById(req.params.id).populate({
    path:'bootcamp',
    select:'name description'
   });

   if (!review) {
    return next(new ErrorResponse('No review found',404));
   }
   return res.status(200).json({success:true,data:review});
 
})
