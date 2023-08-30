const express = require('express');
const db = require('./db');
const cors = require('cors');
require('dotenv').config();
const path=require('path');
const { errhandler } = require('./error_handler/handle_err');
const { userroute } = require('./routes/loginandforgetrouter');
const { homeroute } = require('./routes/homerouter');
const { profileroute } = require('./routes/profilerouter');
const { classroute } = require('./routes/classrouter');
const { assignmentroute } = require('./routes/assignmnetrouter');
const { examroute } = require('./routes/examrouter');
const { quizroute } = require('./routes/quizrouter');
const { paymentroute } = require('./routes/paymentcontroller');
//const {logoRoutes} = require("./routes/ShowLogoRoutes");
const { BannerRoutes } = require('./routes/BannerRoutes');
const app = express();
app.use(cors());
app.use(express.urlencoded ({extended: true}))
app.use('/public',express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use("/",userroute);
app.use("/",homeroute);
app.use("/",profileroute);
app.use("/",classroute);
app.use("/",assignmentroute);
app.use("/",examroute);
app.use("/",quizroute)
app.use("/",paymentroute)
//app.use("/",logoRoutes);
app.use("/",BannerRoutes);
app.use(errhandler)

app.use("/",async(req,res)=>{
  res.send("<h1>Welcome to the server</h1>");
});

// app.post( "/login", async function ( req, res ) {
//   const toBeRegister_UserData = req.body;

//   console.table( toBeRegister_UserData )

//   await setDoc( doc( db, "User", toBeRegister_UserData.email ), toBeRegister_UserData ).then( () => {
//       console.log( "User Added successfully !" );

//       res.redirect( '/' )
//   } ).catch( ( er1 ) => {
//       console.error( "Error Updating document: ", er1 );
//   } );

// } )

app.listen(2000, () => {
    console.log('Server started on port - 2000');
  });