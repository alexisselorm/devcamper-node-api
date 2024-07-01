const express = require('express');
const advancedResults = require('../middleware/advancedResults');
const Review = require('../models/review.model');
const {protect, authorize} = require('../middleware/auth.middleware');
const { getReviews, getReview } = require('../controllers/reviews.controller');


const router = express.Router({mergeParams:true});

router.route('/')
.get( advancedResults(Review,{path:'bootcamp',select:'name description'}) ,getReviews)

router.route('/:id')
.get(getReview);
module.exports = router