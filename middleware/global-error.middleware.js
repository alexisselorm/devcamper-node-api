const ErrorResponse = require("../utils/errorHandler");

const errorHandler = (err,req,res,next)=>{
  let error = {...err};

  error.message = err.message;
  console.log(err.name);
  console.log(err.stack.red);

  //Mongoose bad ObjectId
  if(err.stack.includes('Cast')){
    const message = `Resource with Id ${err.value} not found`;
    error = new ErrorResponse(message,404);
  }

  //Mongoose duplicate key
  if (err.code == 11000) {
    const message = `Duplicate key entered`;
    error = new ErrorResponse(message,400);
  }

  //Mongoose validation error
 if (err.name == 'ValidationError'){
  const message = Object.values(err.errors).map(err => err.message);
  error = new ErrorResponse(message,400)
 }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message
  });
}

module.exports = errorHandler;