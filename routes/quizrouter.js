const express=require('express');

const { tokenval } = require('../middlewares/tokenval');
const { get_completed_quiz, view_upcom_quiz, view_completed_quiz, get_upcom_quiz, triveaquiz, stu_res_quiz } = require('../controllers/quizcontroller');
const quizroute=express.Router();
quizroute.route('/get/upcoming/quiz').get(tokenval,get_upcom_quiz);
quizroute.route('/get/completed/quiz').get(tokenval,get_completed_quiz);
quizroute.route('/view/completed/quiz').post(tokenval,view_completed_quiz);
quizroute.route('/view/upcoming/quiz').post(tokenval,view_upcom_quiz);
quizroute.route('/join/upcoming/quiz').post(tokenval,triveaquiz);
quizroute.route('/submit/quiz').post(tokenval,stu_res_quiz);
module.exports={quizroute};