const knex = require("../db");
const moment= require("moment");
const { trycatch } = require("../error_handler/try_catch_handler");


var  get_upcom_payments=async(req,res,next)=>{

    var currentDate = moment();
    var formattedDate = currentDate.format("YYYY-MM-DD");

    const upcom_payment =await knex("emis").select("emi_amount","invoice_id","emi_date","status").where("student_id",req.student_id).andWhere("emi_date",">",formattedDate);

    for(let i of upcom_payment){
        const {remarks,description}=await knex("invoices").select("remarks","description").where("id",i.invoice_id).first();
        
        i["description"]=description;

    }

  

    res.send({status:1,upcom_payment});
}

var view_upcom_payment=async(req,res,next)=>{

    const {emi_id}=req.body;
    const upcom_payment =await knex("emis").select("invoice_id","emi_amount","emi_date","status").where("id",emi_id).first();

    const {remarks,description}=await knex("invoices").select("remarks","description").where("id",upcom_payment.invoice_id).first();
        
    upcom_payment["description"]=description;
    upcom_payment["remarks"]=remarks;

    
    res.send({status:1,upcom_payment})
}
var view_overdue_payment=async(req,res,next)=>{

    const {emi_id}=req.body;
    const over_payment =await knex("emis").select("invoice_id","emi_amount","emi_date","remark","status").where("id",emi_id).first()

    const {remarks,description}=await knex("invoices").select("remarks","description").where("id",upcom_payment.invoice_id).first();
        
    over_payment["description"]=description;
    over_payment["remarks"]=remarks;

    res.send({status:1,over_payment})
}
var  get_completed_payments=async(req,res,next)=>{

    const current_date=moment().valueOf();

    const upcom_payment =await knex("emis").select("invoice_id","emi_amount","emi_date","status","paid_date").where("student_id",req.student_id).andWhere("status",1);
    for(let i of upcom_payment){
        const {remarks,description}=await knex("invoices").select("remarks","description").where("id",i.invoice_id).first();
        
        i["description"]=description;

    }

 
   
    res.send({status:1,upcom_payment})
}

var  get_overdue_payments=async(req,res,next)=>{

    var currentDate = moment();
    var formattedDate = currentDate.format("YYYY-MM-DD");

    const due_payment =await knex("emis").select("invoice_id","emi_amount","emi_date","status",).where("student_id",req.student_id).andWhere("status",0).andWhere("emi_date","<",formattedDate)

    for(let i of due_payment){
        const {remarks,description}=await knex("invoices").select("remarks","description").where("id",i.invoice_id).first();
        
        i["description"]=description;

    }


    res.send({status:1,due_payment})
}

get_completed_payments=trycatch(get_completed_payments);
get_overdue_payments=trycatch(get_overdue_payments);
view_overdue_payment=trycatch(view_overdue_payment);
view_upcom_payment=trycatch(view_upcom_payment);
get_upcom_payments=trycatch(get_upcom_payments);

module.exports={get_completed_payments,get_overdue_payments,get_overdue_payments,view_upcom_payment,get_upcom_payments}

