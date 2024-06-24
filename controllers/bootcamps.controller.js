const Bootcamp = require('../models/bootcamp.model')

// @desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({ success: true, msg: "Show all bootcamps",count:bootcamps.length ,  data: bootcamps });
  } catch (error) {
    res.status(500).json({ success: false, msg: ` ${error.message}`, data: [] });

  }
}

// @desc Get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return res.status(404).json({ success: false, msg: `No bootcamp with that name`, data: [] });
    }

    res.status(200).json({ success: true, msg: "Show bootcamp", data: bootcamp });
  } catch (error) {
    res.status(500).json({ success: false, msg: ` ${error.message}`, data: [] });

  }
}


// @desc Get single bootcamp
//@route POST /api/v1/bootcamps
//@access Prive
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, msg: `Successfully created bootcamp`, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false, msg: `Bad request ${error.message}`, data: [] });

  }

}


// @desc Get single bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Prive
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!bootcamp) {
      return res.status(400).json({ success: false, msg: `Bad request`, data: {} });
    }
    res.status(200).json({ success: true, msg: `Bootcamp deleted successfully`, data: {} });
  } catch (error) {

    res.status(400).json({ success: true, msg: error.message, data: [] });
  }

}

// @desc Get single bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Prive
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false, msg: `Bad request`, data: [] });
    }
    res.status(200).json({ success: true, msg: `Bootcamp update`, data: bootcamp });
  } catch (error) {

    res.status(400).json({ success: true, msg: error.message, data: [] });
  }
}