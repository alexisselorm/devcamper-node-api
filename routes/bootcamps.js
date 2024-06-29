const express = require('express');
const Bootcamp = require('../models/bootcamp.model');

const {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload} =require('../controllers/bootcamps.controller')


// Include other resource routers
const courseRouter = require('./courses');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();
const {protect, authorize} = require('../middleware/auth.middleware')


router.use('/:bootcampId/courses',courseRouter)

router.route('/')
.get(advancedResults(Bootcamp,'courses'),getBootcamps)
.post(protect,authorize('publisher','admin'),createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(protect,authorize('publisher','admin'),updateBootcamp)
.delete(protect,authorize('publisher','admin'),deleteBootcamp);

router.route('/:id/photo').
put(protect,authorize('publisher','admin'),bootcampPhotoUpload)

router.route('/radius/:zipcode/:distance')
.get(getBootcampsInRadius)
module.exports = router