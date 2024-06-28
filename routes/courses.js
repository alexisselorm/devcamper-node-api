const express = require('express');
const { getCourses, getCourse,createCourse } = require('../controllers/courses.controller');


const router = express.Router({mergeParams:true});

router.route('/')
.get(getCourses)
.post(createCourse)

router.route('/:id')
.get(getCourse)
// .post(createBootcamp);

// router.route('/:id')
// .get(getBootcamp)
// .put(updateBootcamp)
// .delete(deleteBootcamp);
module.exports = router