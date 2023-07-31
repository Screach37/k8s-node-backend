const express=require('express');

const { tokenval } = require('../middlewares/tokenval');
const { read_upcom_class, read_completed_class, view_class_detail } = require('../controllers/classcontroller');
const classroute=express.Router();
classroute.route('/get/upcoming/classes').get(tokenval,read_upcom_class);
classroute.route('/get/completed/classes').get(tokenval,read_completed_class);
classroute.route('/getclass/byid').post(tokenval,view_class_detail);
module.exports={classroute};