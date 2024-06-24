const express= require('express');
const dotenv = require('dotenv');

//Routes
const bootcamps = require('./routes/bootcamps');


dotenv.config({path:'./config.env'});

const app = express();

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);


app.get('/', (req,res)=>{
  res.status(400).json({data:"Hello from Express"})
})


PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server running on ${process.env.NODE_ENV} listening on localhost:${PORT}`);
});