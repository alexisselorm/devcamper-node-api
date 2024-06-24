const express= require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

//Routes
const bootcamps = require('./routes/bootcamps');


dotenv.config({path:'./config.env'});

const connectDB = require('./config/db');
const app = express();

//connect to database
connectDB();

//Dev logging middeware
if (process.env.NODE_ENV=='development') {
  app.use(morgan('dev'))
}


//Mount routers
app.use('/api/v1/bootcamps', bootcamps);


app.get('/', (req,res)=>{
  res.status(400).json({data:"Hello from Express"})
})


PORT = process.env.PORT || 5000;

const server = app.listen(PORT,()=>{
  console.log(`Server running on ${process.env.NODE_ENV} listening on localhost:${PORT}`.yellow.bold);
});

//Handle unhandled promise rejections
process.on("unhandledRejection",(err,promiise)=>{
  console.log(`Error: ${err.message}`.red);
  
  //Close server and exit immediately
  server.close(()=>{
    process.exit(1);

  });
}) 