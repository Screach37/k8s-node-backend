const express=require('express');

const { tokenval } = require('../middlewares/tokenval');
const { get_upcom_exams, view_upcom_exam, get_completed_exams, view_completed_exam } = require('../controllers/examcontroller');
const examroute=express.Router();
examroute.route('/get/upcom/exam').get(tokenval,get_upcom_exams);
examroute.route('/get/completed/exam').get(tokenval,get_completed_exams);
examroute.route('/view/upcom/exam').post(tokenval,view_upcom_exam);
examroute.route('/view/completed/exam').post(tokenval,view_completed_exam);
module.exports={examroute};