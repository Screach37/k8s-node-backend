const express=require('express');

const { tokenval } = require('../middlewares/tokenval');
const { read_upcom_assignment, read_completed_assignment, submit_assignment, view_submit_assignment, view_upcoming_assignment, view_completed_assignment_undec } = require('../controllers/assignmentcontroller');
const { upload } = require('../middlewares/multermiddleware');
const assignmentroute=express.Router();
assignmentroute.route('/get/upcom/assignments').get(tokenval,read_upcom_assignment);
assignmentroute.route('/get/completed/assignments').get(tokenval,read_completed_assignment);
assignmentroute.route('/submit/assignments').post(tokenval,upload.single('stu_res'),submit_assignment);
assignmentroute.route('/view/completed/assignments/dec').post(tokenval,view_submit_assignment);
assignmentroute.route('/view/upcoming/assignments').post(tokenval,view_upcoming_assignment);
assignmentroute.route('/view/completed/assignments/undec').post(tokenval,view_completed_assignment_undec);
module.exports={assignmentroute};