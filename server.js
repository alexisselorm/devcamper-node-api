const express= require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/global-error.middleware');
const cookieParser = require('cookie-parser');
const path = require('node:path');
dotenv.config({path:'./config.env'});

//Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/user');


const connectDB = require('./config/db');
const app = express();
app.use(express.json());
app.use(fileupload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

// Body parser

//connect to database
connectDB();

//Dev logging middeware
if (process.env.NODE_ENV=='development') {
  app.use(morgan('dev'))
}


//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

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