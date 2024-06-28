const express = require('express');
const { getCourses, getCourse,createCourse, updateCourse, deleteCourse } = require('../controllers/courses.controller');


const router = express.Router({mergeParams:true});

router.route('/')
.get(getCourses)
.post(createCourse)

router.route('/:id')
.get(getCourse)
.put(updateCourse)
.delete(deleteCourse);
// .post(createBootcamp);

// router.route('/:id')
// .get(getBootcamp)
module.exports = router