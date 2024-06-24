// @desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps =(req,res,next)=>{
  res.status(200).json({success:true,msg:"Show all bootcamps"});
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
exports.createBootcamp =(req,res,next)=>{
  res.status(200).json({success:true,msg:`Create new bootcamp`});
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