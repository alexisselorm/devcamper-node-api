const express = require('express');
const { getCourses } = require('../controllers/courses.controller');


const router = express.Router({mergeParams:true});

router.route('/')
.get(getCourses)
// .post(createBootcamp);

// router.route('/:id')
// .get(getBootcamp)
// .put(updateBootcamp)
// .delete(deleteBootcamp);
module.exports = router