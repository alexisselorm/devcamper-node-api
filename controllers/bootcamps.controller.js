const Bootcamp = require('../models/bootcamp.model');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const geocoder = require('../utils/geocoder');
const path = require('node:path');
// @desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to Exclude
  const removeFields = ['select', 'sort'];

  //Loop over removedFields and delete them from reqQuery
  removeFields.forEach(val => {
    delete reqQuery[val];
  });

  //Create query string
  let queryString = JSON.stringify(reqQuery);
  //Create mongo operators
  queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  console.log(queryString);

  queryString = JSON.parse(queryString);
  //Finding the resource
  query = Bootcamp.find(queryString).populate('courses');
  //SELECT fields needed.
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //Sort 
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); //dECENDING CREATED AT
  }


  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Pagination results
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }
  const bootcamps = await query;
  res.status(200).json({ success: true, msg: "Show all bootcamps", count: bootcamps.length, data: bootcamps, pagination });

})

// @desc Get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return res.status(404).json({ success: false, msg: `No bootcamp with that name`, data: [] });
  }

  res.status(200).json({ success: true, msg: "Show bootcamp", data: bootcamp });

})


// @desc Create a bootcamp
//@route POST /api/v1/bootcamps
//@access Prive
exports.createBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, msg: `Successfully created bootcamp`, data: bootcamp });

})


// @desc Update single bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Prive
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return res.status(400).json({ success: false, msg: `Bad request`, data: {} });
  }
  res.status(200).json({ success: true, msg: `Bootcamp deleted successfully`, data: {} });


})

// @desc Delete bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Prive
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return res.status(400).json({ success: false, msg: `Bad request`, data: [] });
  }
  console.log(bootcamp);
  await bootcamp.deleteOne();
  res.status(200).json({ success: true, msg: `Bootcamp deleted`, data: bootcamp });

})

// @desc Get  bootcamps with a radius
//@route PUT /api/v1/bootcamps/:zipcode/:distance
//@access Prive
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {

  const { zipcode, distance } = req.params;

  //Get lon and lat

  const loc = await geocoder.geocode(zipcode);
  const lat = await loc[0].latitude;
  const lon = await loc[0].longitude;

  //Calc radius usin radians
  //Divide distance by radius of earth
  //Earth radius = 3963 miles / 6378km
  let radiusOfEarth = 3963
  const radius = distance / radiusOfEarth

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $cenerSphere: [[lon, lat], radius] } }
  })

  if (!bootcamps) {
    return res.status(400).json({ success: false, msg: `Bad request`, data: [] });
  }
  res.status(200).json({ success: true, msg: `Bootcamp update`, data: bootcamps });

})



// @desc Upload photo for bootcamp
//@route PUT /api/v1/bootcamps/:id/photo
//@access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return res.status(400).json({ success: false, msg: `Bad request`, data: [] });
  }
  if (!req.files) {
    return res.status(400).json({ success: false, msg: `Please upload a file`, data: [] });
  }

  const file = req.files["undefined"]
  console.log(req.files);


  //  Check if the file is an image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`, 400));
  }
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err =>{
    if(err){
      console.log(err);
      return next(new ErrorResponse(`${err.message}`,500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name},{new:true});

  })

  res.status(200).json({ success: true, msg: `Image Uploaded`, data: bootcamp });

})