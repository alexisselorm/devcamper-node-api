const express= require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const errorHandler = require('./middleware/global-error.middleware');
dotenv.config({path:'./config.env'});
//Routes
const bootcamps = require('./routes/bootcamps');



const connectDB = require('./config/db');
const app = express();

// Body parser
app.use(express.json());

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

app.use(errorHandler)
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