const express=require('express');

const { tokenval } = require('../middlewares/tokenval');
const { get_upcom_payments, view_upcom_payment, get_completed_payments, get_overdue_payments } = require('../controllers/paymentscontroller');
const paymentroute=express.Router();
paymentroute.route('/get/upcom/payments').get(tokenval,get_upcom_payments);
paymentroute.route('/view/upcom/payments').post(tokenval,view_upcom_payment);
paymentroute.route('/get/completed/payments').get(tokenval,get_completed_payments);

paymentroute.route('/get/overdue/payments').get(tokenval,get_overdue_payments);
paymentroute.route('/view/overdue/payments').get(tokenval,view_upcom_payment);


module.exports={paymentroute};