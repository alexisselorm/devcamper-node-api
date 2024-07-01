const mongoose = require('mongoose');
const colors = require('colors');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})

// Load Model
const Bootcamp = require('./models/bootcamp.model');
const Course = require('./models/course.model');
const User = require('./models/user.model');

mongoose.connect(process.env.MONGO_URI);

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))

const importData = async()=>{
  try {
    console.log("importing bootcamps".green.inverse);
    await Bootcamp.create(bootcamps);
    console.log("importing courses".green.inverse);
    await Course.create(courses);
    console.log("importing users".green.inverse);
    await User.create(users);


    console.log("Data imported".green.inverse);
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
}

const deleteData = async()=>{
  try {
    console.log("deleting bootcamps".red.inverse);

    await Bootcamp.deleteMany();
    console.log("deleting courses".red.inverse);
    await Course.deleteMany();
    console.log("deleting users".red.inverse);
    await User.deleteMany();

    console.log("Data deleted".red.inverse);
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
}

if (process.argv[2]=='-i') {
  importData();
}
else if (process.argv[2]=='-d') {
  deleteData();
}else{
  console.log("Invalid argument".yellow.italic.inverse);
  process.exit(0);

}
