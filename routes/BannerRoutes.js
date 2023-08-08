const express=require('express');

const { Banner } = require('../controllers/BannerController');
const BannerRoutes=express.Router();
BannerRoutes.route('/get/Banner').get(Banner);
module.exports={BannerRoutes};