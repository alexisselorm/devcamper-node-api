const mongoose = require('mongoose');
const colors = require('colors');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})

// Load Model
const Bootcamp = require('./models/bootcamp.model');

mongoose.connect(process.env.MONGO_URI);

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))

const importData = async()=>{
  try {
    console.log("Data importing".green.inverse);
    await Bootcamp.create(bootcamps);

    console.log("Data imported".green.inverse);
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
}

const deleteData = async()=>{
  try {
    await Bootcamp.deleteMany();

    console.log("Data deleted".red.inverse);
  } catch (error) {
    console.log(error);
  }
}

if (process.argv[2]=='-i') {
  importData();
}
else if (process.argv[2]=='-d') {
  deleteData()
}else{
  console.log("Invalid argument".yellow.italic.inverse);
  process.exit(0);

}
