const Bootcamp = require('../models/bootcamp.model')

// @desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps =(req,res,next)=>{
  res.status(200).json({success:true,msg:"Show all bootcamps",hello:req.hello});
}

// @desc Get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp =(req,res,next)=>{
  res.status(200).json({success:true,msg:`Show  bootcamps ${req.params.id}`});
}


// @desc Get single bootcamp
//@route POST /api/v1/bootcamps
//@access Prive
exports.createBootcamp = async( req,res,next)=>{
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({success:true,msg:`Successfully created bootcamp`, data:bootcamp});
  } catch (error) {
    res.status(400).json({success:false,msg:`Bad request ${error.message}`, data:[]});
    
  }
 
}


// @desc Get single bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Prive
exports.updateBootcamp =(req,res,next)=>{
  res.status(200).json({success:true,msg:`Update  bootcamp ${req.params.id}`});
}

// @desc Get single bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Prive
exports.deleteBootcamp =(req,res,next)=>{
  res.status(200).json({success:true,msg:`Delete bootcamp ${req.params.id}`});
}