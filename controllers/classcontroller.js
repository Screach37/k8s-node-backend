const moment=require('moment');
const knex = require('../db');
const { trycatch } = require('../error_handler/try_catch_handler');
var read_upcom_class=async(req,res,next)=>{
    console.log(req.student_id)

    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    console.log(batch_id)


    const currenttime = moment().valueOf();
    console.log(currenttime)

    const clases =await knex("classes").select("id","start_time","end_time","class_topic").where("bat_id",batch_id).andWhere("end_time",">",currenttime)
    
    for(let i of clases){
        i.start_time = moment(i.start_time).format('YYYY-MM-DDTHH:mm:ss');
        i.end_time = moment(i.end_time).format('YYYY-MM-DDTHH:mm:ss');
        
    }
    res.send({status:1,clases})

    
}
var read_completed_class=async(req,res,next)=>{

    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();


    const currenttime = moment().valueOf();
    console.log(currenttime)

    const clases =await knex("classes").select("id","start_time","end_time","class_topic").where("bat_id",batch_id).andWhere("end_time","<",currenttime)
    
    for(let i of clases){
        i.start_time = moment(i.start_time).format('YYYY-MM-DDTHH:mm:ss');
        i.end_time = moment(i.end_time).format('YYYY-MM-DDTHH:mm:ss');
        
    }
    res.send({status:1,clases})

    
}

var view_class_detail=async(req,res,next)=>{
    const {class_id}=req.body;
    const clases =await knex("classes").select("start_time","end_time","class_topic","attachments","instructor_id").where("id",class_id).first();
    // console.log(clases)

    clases.start_time = moment(clases.start_time).format('YYYY-MM-DDTHH:mm:ss');
        clases.end_time = moment(clases.end_time).format('YYYY-MM-DDTHH:mm:ss');


    const inst=await knex("instructors").select("name").where("id",clases.instructor_id).first()

    const sen={...clases,instructor_name:inst.name}

    res.send({status:1,sen})

     

}
view_class_detail=trycatch(view_class_detail)
read_upcom_class=trycatch(read_upcom_class);
read_completed_class=trycatch(read_completed_class);
module.exports={read_upcom_class,read_completed_class,view_class_detail}