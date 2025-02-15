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



//@desc Add review
//@route POST /api/v1/bootcamps/:bootcampId/reviews/
//@access Private
exports.addReview = asyncHandler(async(req,res,next)=>{

   req.body.bootcamp = req.params.bootcampId;

  req.body.user= req.user._id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
 console.log(req.body);

  if(!bootcamp) return next(new ErrorResponse("Bootcamp not found",404));
  const  review = await Review.create(req.body);
  return res.status(201).json({success:true,data:review});

})


//@desc Update review
//@route POST /api/v1/reviews/:id
//@access Private
exports.updateReview = asyncHandler(async(req,res,next)=>{
let review = await Review.findById(req.params.id);

if(!review) return next(new ErrorResponse('No review found with this ID',404));

//Make sure review belongs to user or user is admin
if(review.user.toString() !==req.user._id && req.user.role!=='admin') return next(new ErrorResponse('Not authorized to update review',401));

  review = await Review.findByIdAndUpdate(req,params.id,req.body,{
    new:true,
    runValidators:true
  });
 return res.status(201).json({success:true,data:review});

})

//@desc Delete review
//@route POST /api/v1/reviews/:id
//@access Private
exports.updateReview = asyncHandler(async(req,res,next)=>{
  let review = await Review.findById(req.params.id);
  
  if(!review) return next(new ErrorResponse('No review found with this ID',404));
  
  //Make sure review belongs to user or user is admin
  if(review.user.toString() !==req.user._id && req.user.role!=='admin') return next(new ErrorResponse('Not authorized to update review',401));
  
    await review.deleteOne();
   return res.status(201).json({success:true,data:review});
  
  })
  