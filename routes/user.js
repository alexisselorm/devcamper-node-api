const express = require('express');
const { getUsers, getUser,createUser, updateUser, deleteUser } = require('../controllers/users.controller');
const User = require('../models/user.model');
const advancedResults = require('../middleware/advancedResults');
const {protect, authorize} = require('../middleware/auth.middleware')


const router = express.Router({mergeParams:true});

router.use(protect);
router.use(authorize('admin'));


router.route('/')
.get(advancedResults(User),getUsers)
.post(createUser);

router.route('/:id')
.get(getUser)
.put(updateUser)
.delete(deleteUser)

module.exports=router