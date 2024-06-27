const Bootcamp = require('../models/bootcamp.model');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const geocoder = require('../utils/geocoder');
// @desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  let query;

  //Copy req.query
  const reqQuery = {...req.query};

  //Fields to Exclude
  const removeFields = ['select','sort'];

  //Loop over removedFields and delete them from reqQuery
  removeFields.forEach(val=>{
    delete reqQuery[val];
  });

  //Create query string
  let queryString = JSON.stringify(reqQuery);
  //Create mongo operators
  queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  console.log(queryString);

  queryString = JSON.parse(queryString);
  //Finding the resource
  query = Bootcamp.find(queryString);
  //SELECT fields needed.
  if(req.query.select){
    const fields  = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //Sort 
  if(req.query.sort){
    const sortBy  = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }else{
    query = query.sort('-createdAt'); //dECENDING CREATED AT
  }



  const bootcamps = await query;
  res.status(200).json({ success: true, msg: "Show all bootcamps", count: bootcamps.length, data: bootcamps });

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
  res.status(200).json({ success: true, msg: `Bootcamp update`, data: bootcamp });

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