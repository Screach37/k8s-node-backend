const { str } = require("ajv");
const { trycatch } = require("../error_handler/try_catch_handler");
const knex = require("../db");
const moment=require("moment")

var get_upcom_exams=async(req,res,next)=>{
    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    console.log(batch_id)


    const currenttime = moment().valueOf(); 
    console.log(currenttime)


    const exams = await knex('exam_batches').pluck("examId").where("batchId",batch_id);
    console.log(exams)

    const exam =await knex("exams").select("id","exam_name","start_time","end_time","cou_name").where("end_time",">",currenttime).whereIn("id",exams)
    
    for(let i of exam){
        i.start_time = moment(i.start_time).format('YYYY-MM-DDTHH:mm:ss');
        i.end_time = moment(i.end_time).format('YYYY-MM-DDTHH:mm:ss');
        
    }
    res.send({status:1,exam})
}

var view_upcom_exam=async(req,res,next)=>{
    const{exam_id}=req.body
    const exam =await knex("exams").select("tot_marks","sub_name","exam_name","start_time","end_time","cou_name").where("id",exam_id).first();
    exam.start_time = moment(exam.start_time).format('YYYY-MM-DDTHH:mm:ss');
    exam.end_time = moment(exam.end_time).format('YYYY-MM-DDTHH:mm:ss');
    res.send({status:1,exam})
}
var get_completed_exams=async(req,res,next)=>{
    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    console.log(batch_id)


    const currenttime = moment().valueOf();
    console.log(currenttime)


    const exams = await knex('exam_batches').pluck("examId").where("batchId",batch_id);
    console.log(exams)

    const exam =await knex("exams").select("exams.is_res_dec","exams.id","exams.exam_name","exams.start_time","exams.end_time","exams.cou_name","exam_result.status").innerJoin('exam_result', function() {
        this.on('exams.id', '=', 'exam_result.exam_id')
            .andOn('exam_result.stu_id', '=', req.student_id);
      }).whereIn("exams.id",exams).andWhere("exams.end_time","<",currenttime).orderBy('exams.is_res_dec', 'desc')
    
    for(let i of exam){
        i.start_time = moment(i.start_time).format('YYYY-MM-DDTHH:mm:ss');
        i.end_time = moment(i.end_time).format('YYYY-MM-DDTHH:mm:ss');
        
    }
    res.send({status:1,exam})
}

var view_completed_exam=async(req,res,next)=>{

    const {exam_id}=req.body
    const exam =await knex("exams").select("exams.tot_marks","exam_result.marks","exam_result.note","exams.sub_name","exams.id","exams.exam_name","exams.start_time","exams.end_time","exams.cou_name","exam_result.status").innerJoin('exam_result', function() {
        this.on('exams.id', '=', 'exam_result.exam_id')
            .andOn('exam_result.stu_id', '=', req.student_id);
      }).where("exams.id",exam_id).first()
    
   
        exam.start_time = moment(exam.start_time).format('YYYY-MM-DDTHH:mm:ss');
        exam.end_time = moment(exam.end_time).format('YYYY-MM-DDTHH:mm:ss');
        
    
    res.send({status:1,exam})
}
view_completed_exam=trycatch(view_completed_exam)
get_completed_exams=trycatch(get_completed_exams)

view_upcom_exam=trycatch(view_upcom_exam);
get_upcom_exams=trycatch(get_upcom_exams);

module.exports={view_upcom_exam,get_upcom_exams,get_completed_exams,view_completed_exam}