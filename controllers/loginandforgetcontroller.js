const { createerr } = require("../error_handler/create_err")
const jwt= require("jsonwebtoken");
const crypto = require('crypto');
const  nodemailer  = require('nodemailer');

//const bcrypt = require('bcrypt.js');
const moment = require('moment');
const { trycatch } = require("../error_handler/try_catch_handler");
const knex = require("../db");


var student_login = async (req,res,next) => {
 
      const data = req.body;
      console.log("hello",data.email);
      
  
      const query = await knex("students").select('*').where('enrollment_id', data.email).first();
      console.log("hello",query);
  
      if (!query) {
        console.log("heloo")
      return next(new createerr("Invalid email", 300));
      }
  
      const plainpass = data.password;
      var hashpass = query.password;
    
  
  //  hashpass = hashpass.replace(/^\$2y(.+)$/i, '$2b$1');
    
  
     
      // const isMatch=bcrypt.compareSync(plainpass, hashpass);
  
     
  
      
      if (plainpass==hashpass) {
        const payload = {
          id: query.id,
        };
  
        jwt.sign(payload, process.env.secret_key, { expiresIn: '365d' }, (err, tok) => {
          if (err) {
           return next(new createerr("Error in creating token", 200));
          } else {
            return res.send({
              status: 1,
              token: tok,
            });
          }
        });
      } else {
        return next( new createerr("Invalid details", 300));
      }
      
   
  };
  var forgetpass1=async(req,res,next)=>{
  
    const {email}=req.body;
    const validations1= await knex.select('id')
    .from('forget_pass')
    .where('email', email)
    .first();
    if(validations1){
        const rowCount = await knex('forget_pass')
      .where('id', validations1.id)
      .del();

    }
    console.log(email)
    

    const validations= await knex("students").select('*').where('email', email).first()
    console.log(validations)
    if(!validations){
        return next(new createerr("email is not valid",400));

    }

    function generateOTP() {
        const otp = crypto.randomInt(10000).toString().padStart(4, '0');
        return otp;
      }
      
      const otp = generateOTP();
      var currentTimestamp = moment().valueOf();
const twoMinutesInMilliseconds = 2 * 60 * 1000; // 2 minutes = 120 seconds = 120,000 milliseconds
currentTimestamp+=twoMinutesInMilliseconds;



      await knex('forget_pass').insert({email:email,otp,expires_in:currentTimestamp});


    //   sending opt to mail to the user

    const sendmail = async () => {
      
        const transporter =  nodemailer.createTransport({
            service: 'gmail',
    
            auth: {
                user: 'bohocastle@gmail.com',
                pass: 'frpwamfbyuhjsqwv'
            }
        });
    
        let info1 = {
            from: 'bohocastle@gmail.com',
            to: email,
            subject: 'Test Email from Node Mailer',
            text: `your opt for authenticate is ${otp}`
        };
    
         transporter.sendMail(info1, (error, info) => {
            if (error) {
                return next(new createerr(error.message,400))
              
            } else {
    
                console.log('Email sent');
               res.send({status:true,
            message:"email sent"})
            }
        });

}
await sendmail();
   
}
var forgetpass2=async(req,res,next)=>{
   
    const {email,otp}=req.body;
    console.log(otp);
    
    const query= await  knex.select('*')
    .from('forget_pass')
    .where('email', email)
    .first()

    const now_date=moment().valueOf();
    const comp_time=query.expires_in;
    
    
    if(now_date<comp_time){
    // console.log(querry1.otp)
    if(otp==query.otp){
        return res.send({status:true})
    }
    else{
        return next(new createerr("invalid otp",400))
    }
}
else{
    const rowCount = await knex('forget_pass')
      .where('email',email)
      .del();
    return next(new createerr(" otp time expires",400))
}
   

}

var forgetpass3=async(req,res,next)=>{
   
        const {email,password,cpassword}=req.body;
        if(password==cpassword){
          // var hashpass=  bcrypt.hashSync(password,10);
          const rowCount = await knex('students')
          .where('email', email) // Specify the condition for the row to update, e.g., based on the 'id' column
          .update({ 'password': pas`` });
          res.send({status:1,
        message:"password updated"})
        }
        else{
            return next(new createerr("password is not matching",400))
        }

}

student_login=trycatch(student_login);
forgetpass1=trycatch(forgetpass1);
forgetpass2=trycatch(forgetpass2);
forgetpass3=trycatch(forgetpass3);



module.exports={student_login,forgetpass1,forgetpass2,forgetpass3}
