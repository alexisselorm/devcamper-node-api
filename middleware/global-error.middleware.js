
const errorHandler = (err,req,res,next)=>{

  console.log(err.stack.red);

  res.status(err.statusCode || 502).json({
    success: false,
    error: err.message
  });
}

module.exports = errorHandler;