const express=require('express');
const { student_login, forgetpass1,forgetpass2,forgetpass3 } = require('../controllers/loginandforgetcontroller');
const userroute=express.Router()
userroute.route('/login').post(student_login);
userroute.route('/forgetpass1').post(forgetpass1);
userroute.route('/forgetpass2').post(forgetpass2);
userroute.route('/forgetpass3').post(forgetpass3);
module.exports={userroute};