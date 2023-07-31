const path=require('path');
const multer= require('multer');
const { createerr } = require('../error_handler/create_err');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..','public','images'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, Date.now()+ '-' + file.originalname)
    }
  })
  
  var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
    if (  file.mimetype == "application/pdf") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only pdf can upload'));
      }
    }
  });
  

  module.exports={upload};