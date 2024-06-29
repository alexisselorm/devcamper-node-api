const express = require('express');
const { getCourses, getCourse,createCourse, updateCourse, deleteCourse } = require('../controllers/courses.controller');
const advancedResults = require('../middleware/advancedResults');
const Course = require('../models/course.model');
const {protect, authorize} = require('../middleware/auth.middleware')


const router = express.Router({mergeParams:true});

router.route('/')
.get( advancedResults(Course,{path:'bootcamp',select:'name description'}) ,getCourses)
.post(protect,authorize('publisher','admin'),createCourse)

router.route('/:id')
.get(getCourse)
.put(protect,authorize('publisher','admin'),updateCourse)
.delete(protect,authorize('publisher','admin'),deleteCourse);
// .post(createBootcamp);

// router.route('/:id')
// .get(getBootcamp)
module.exports = router