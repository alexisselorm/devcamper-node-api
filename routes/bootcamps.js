const express = require('express');
const Bootcamp = require('../models/bootcamp.model');

const {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload} =require('../controllers/bootcamps.controller')


// Include other resource routers
const courseRouter = require('./courses');
const advancedResults = require('../middleware/advancedResults');


const router = express.Router();


router.use('/:bootcampId/courses',courseRouter)

router.route('/')
.get(advancedResults(Bootcamp,'courses'),getBootcamps)
.post(createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp);

router.route('/:id/photo').
put(bootcampPhotoUpload)

router.route('/radius/:zipcode/:distance')
.get(getBootcampsInRadius)
module.exports = router