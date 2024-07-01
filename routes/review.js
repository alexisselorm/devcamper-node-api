const express = require('express');
const advancedResults = require('../middleware/advancedResults');
const Review = require('../models/review.model');
const {protect, authorize} = require('../middleware/auth.middleware');
const { getReviews, getReview, addReview } = require('../controllers/reviews.controller');


const router = express.Router({mergeParams:true});

router.route('/')
.get( advancedResults(Review,{path:'bootcamp',select:'name description'}) ,getReviews)
.post(protect,authorize('user','admin'),addReview)
router.route('/:id')
.get(getReview);
module.exports = router