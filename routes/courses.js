const express = require('express');
const { getCourses, getCourse,createCourse, updateCourse, deleteCourse } = require('../controllers/courses.controller');
const advancedResults = require('../middleware/advancedResults');
const Course = require('../models/course.model');
const {protect} = require('../middleware/auth.middleware')


const router = express.Router({mergeParams:true});

router.route('/')
.get( advancedResults(Course,{path:'bootcamp',select:'name description'}) ,getCourses)
.post(protect,createCourse)

router.route('/:id')
.get(getCourse)
.put(protect,updateCourse)
.delete(protect,deleteCourse);
// .post(createBootcamp);

// router.route('/:id')
// .get(getBootcamp)
module.exports = router