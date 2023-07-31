const express=require('express');
const { myperformance, student_details, get_classper_by_status, get_quizper_by_status, get_examper_by_status, get_assignmentper_by_status, get_phyclassper_by_status } = require('../controllers/profilecontroller');
const { tokenval } = require('../middlewares/tokenval');
const profileroute=express.Router();
profileroute.route('/myperformance').get(tokenval,myperformance);
profileroute.route('/get/studentdetail').get(tokenval,student_details);
profileroute.route('/get/class/statics').post(tokenval,get_classper_by_status);
profileroute.route('/get/quiz/statics').post(tokenval,get_quizper_by_status);
profileroute.route('/get/exam/statics').post(tokenval,get_examper_by_status);
profileroute.route('/get/assignment/statics').post(tokenval,get_assignmentper_by_status);
profileroute.route('/get/physical/class/statics').post(tokenval,get_phyclassper_by_status);

module.exports={profileroute};