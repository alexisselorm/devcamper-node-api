const express= require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger.middleware');
const morgan = require('morgan');

//Routes
const bootcamps = require('./routes/bootcamps');


dotenv.config({path:'./config.env'});

const app = express();

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

app.listen(PORT,()=>{
  console.log(`Server running on ${process.env.NODE_ENV} listening on localhost:${PORT}`);
});