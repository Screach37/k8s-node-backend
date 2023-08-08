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
const {logoRoutes} = require("./routes/ShowLogoRoutes");
const { BannerRoutes } = require('./routes/BannerRoutes');
const app = express();
app.use(cors());

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
app.use("/",logoRoutes);
app.use("/",BannerRoutes);
app.use(errhandler)

app.use("/",async(req,res)=>{
  res.send("<h1>Welcomesd to the server refreshed 20-7</h1>");
});

app.listen(2000, () => {
    console.log('Server started on port - 2000');
  });
