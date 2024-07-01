const express= require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const helmet = require('helmet');
const xss= require('xss-clean');
const rateLimit= require('express-rate-limit');
const hpp= require('hpp');
const cors= require('cors');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/global-error.middleware');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('node:path');
dotenv.config({path:'./config.env'});

//Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/user');
const reviews = require('./routes/review');


const connectDB = require('./config/db');
const app = express();
app.use(express.json());
app.use(mongoSanitize())

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs:10*60*1000,// 10 minutes,
  max:15
})
app.use(limiter);

//Prevent http param pollution
app.use(hpp());

//Enable cors
app.use(cors());
app.use(fileupload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

// Body parser

//connect to database
connectDB();

//Dev logging middeware
if (process.env.NODE_ENV=='development') {
  app.use(morgan('dev'));
}


//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);


PORT = process.env.PORT || 5000;



app.get('/',(req,res)=>{
  res.send('./public/index.html')
})
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