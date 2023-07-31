
const knex = require("../db");
const moment = require('moment');
const { trycatch } = require("../error_handler/try_catch_handler");

var home=async(req,res,next)=>{

    const sending={};


    const count = await knex('courses').count('* as rowCount').first();
    const rowCount = count.rowCount;
    const count2 = await knex('prerecordedcources').count('* as rowCount').first();
    const rowCount2 = count2.rowCount;
    var tot_count=rowCount+rowCount2

    sending["total_courses"]=tot_count;

    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    
    const hn = await knex('prereccou_student').pluck("prereccou_id").where("stu_id",req.student_id);
    // console.log(hn)
    var arr_length=hn.length+1
    sending["enrolled_courses"]=arr_length;
    

    const timeValue = moment().valueOf();
    const Time = moment(1688549400000).format('YYYY-MM-DDTHH:mm');
    console.log(Time)
    console.log(batch_id)

    
   
    const class_detail = await knex('classes').select("*").where("bat_id",batch_id).andWhere("end_time",">",timeValue).first();
    if(class_detail){
    class_detail.end_time=moment(class_detail.end_time).format('YYYY-MM-DDTHH:mm')
    class_detail.start_time=moment(class_detail.start_time).format('YYYY-MM-DDTHH:mm')}
    sending["class_detail"]=class_detail;
    console.log(class_detail)
    console.log("hello")

    const quizes = await knex('bat_quizes').pluck("quizId").where("batchId",batch_id);



    const quiz_detail = await knex('quizes').select("*").whereIn("id",quizes).andWhere("history",">",timeValue).first();
    if(quiz_detail){
    quiz_detail.end_time=moment(quiz_detail.end_time).format('YYYY-MM-DDTHH:mm')
    quiz_detail.start_time=moment(quiz_detail.start_time).format('YYYY-MM-DDTHH:mm')
    }
    sending["quiz_detail"]=quiz_detail;

    const assignments = await knex('bat_assignments').pluck("assignmentId").where("batchId",batch_id);

    const assignment_detail = await knex('assignments').select("*").whereIn("id",assignments).andWhere("due_time",">",timeValue).first();

    if(assignment_detail){
    assignment_detail.due_time=moment(assignment_detail?.due_time).format('YYYY-MM-DDTHH:mm')
    assignment_detail.sch_time=moment(assignment_detail?.sch_time).format('YYYY-MM-DDTHH:mm')
    }
    sending["assignment_detail"]=assignment_detail



    const hn3 = await knex('prereccou_student').pluck("prereccou_id").where("stu_id",req.student_id);

    const prereccourse=await knex('prerecordedcources').select("banner","course_duration","cource_price","cource_finalprice","name","id").whereIn("id",hn).first();
    sending["prereccourse"]=prereccourse



    const exam = await knex('exam_batches').pluck("examId").where("batchId",batch_id);

    const exams= await knex('exams').select("*").whereIn("id",exam,).andWhere("end_time",">",timeValue).first();
    if(exams){
    exams.end_time=moment(exams.end_time).format('YYYY-MM-DDTHH:mm')
    exams.start_time=moment(exams.start_time).format('YYYY-MM-DDTHH:mm')}
    sending["exams"]=exams



    res.send({status:1,sending})




   
    

}

var getprereccou=async(req,res,next)=>{
 
    const prereccourse=await knex('prerecordedcources').select("banner","course_duration","cource_price","cource_finalprice","name","id");
     res.send({status:1,prereccourse})
}

var getcou=async(req,res,next)=>{
 
    const course=await knex('courses').select("banner","course_price","discount_price","name","id");
     res.send({status:1,course})
}

var get_enroll_prereccou=async(req,res,next)=>{
    const hn = await knex('prereccou_student').pluck("prereccou_id").where("stu_id",req.student_id);

    const prereccourse=await knex('prerecordedcources').select("banner","course_duration","cource_price","cource_finalprice","name","id").whereIn("id",hn);
    res.send({status:1,prereccourse})
}
var get_enroll_live_course=async(req,res,next)=>{

    const {course_id} = await knex('students').select("course_id").where("id",req.student_id).first();
    const course=await knex('courses').select("banner","course_price","discount_price","name","id").where("id",course_id).first();
    res.send({status:1,course})

}
home =trycatch(home)
getprereccou =trycatch(getprereccou);
getcou =trycatch(getcou);
get_enroll_prereccou =trycatch(get_enroll_prereccou);
get_enroll_live_course=trycatch(get_enroll_live_course)

module.exports={home,getprereccou,getcou,get_enroll_prereccou,get_enroll_live_course};