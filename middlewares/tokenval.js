const jwt = require("jsonwebtoken");
const { createerr } = require("../error_handler/create_err");



const tokenval=async(req,res,next)=>{
  try{
    let token=req.header('authorization');
    token=token.split(" ")
    if(!token){
        return(new createerr("please provide token in header",400))
    }
    try{
        const {id} =jwt.verify(token[1],process.env.secret_key)
        req.student_id=id
        next()

    }
  catch(err){
    next(new createerr(err.message,400))
  }
}
catch(err){
  console.log(err);
  res.send({status:0,err,msg:"prove the token"})
}
}
module.exports={tokenval};