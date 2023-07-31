const errhandler=(err,req,res,next)=>{

    console.log(err);
   
    if (err.name === 'ValidationError') {
        const validationErrors = err.details.map((validationError) => validationError.message);
        res.send({ status:0,validationerror: validationErrors });
      } else {
        res.send({ status:0,internalerror: err.message });
      }
}
module.exports={errhandler}

