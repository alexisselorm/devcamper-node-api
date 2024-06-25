const ErrorResponse = require("../utils/errorHandler");

const errorHandler = (err,req,res,next)=>{
  let error = {...err};
  error.message = err.message;
  console.log(err.stack.red);

  //Mongoose bad ObjectId
  if(err.stack.includes('Cast')){
    const message = `Bootcamp with Id ${err.value} not found`;
    error = new ErrorResponse(message,404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message
  });
}

module.exports = errorHandler;