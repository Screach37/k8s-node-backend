const express=require('express');
const { home, getprereccou, getcou, get_enroll_prereccou, get_enroll_live_course } = require('../controllers/homecontroller');
const { tokenval } = require('../middlewares/tokenval');

const homeroute=express.Router()
homeroute.route('/home').get(tokenval,home);
homeroute.route('/get/prereccou').get(tokenval,getprereccou);
homeroute.route('/get/cou').get(tokenval,getcou);
homeroute.route('/get/enroll/prereccou').get(tokenval,get_enroll_prereccou);
homeroute.route('/get/enroll/live/cou').get(tokenval,get_enroll_live_course);

module.exports={homeroute};