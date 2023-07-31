const knex = require("../db");
const { trycatch } = require("../error_handler/try_catch_handler");

var myperformance=async(req,res,next)=>{

    

    myperformance={}

   

    const {batch_id,enrollment_id} = await knex('students').select("batch_id","enrollment_id").where("id",req.student_id).first();


    var phy_class_array=knex("attendence").pluck("id").where("user_id",enrollment_id);
    phy_class_array=phy_class_array.length

    var specific_phy_class_array=knex("attendence").pluck("id").where("user_id",enrollment_id).andWhere("status","present");
    specific_phy_class_array=specific_phy_class_array.length

    var phy_att=(specific_phy_class_array/phy_class_array)*100

    myperformance["physical_class"]=Math.floor(phy_att)



    const clas=await knex("classes").pluck("id").where("bat_id",batch_id).andWhere("is_att_dec",1);
    var tot_class=clas.length;
    const attendence=await knex("class_attendence").select("id").where("stu_id",req.student_id).andWhere("attend_status","persent").whereIn("class_id",clas);
    var tot_attendence=attendence.length;
    const persentage = (tot_attendence / tot_class) * 100;
    myperformance["class"]=Math.floor(persentage)


    const quizes = await knex('bat_quizes').pluck("quizId").where("batchId",batch_id);
    const quiz=await knex("quizes").select("id").whereIn("id",quizes);
    var tot_quiz=quiz.length;
    const quizresult=await knex("quiz_result").select("id").where("stu_id",req.student_id).andWhere("status","pass");
    var tot_quizresult=quizresult.length;
    const quizpersentage = (tot_quizresult/ tot_quiz) * 100;
    myperformance["quiz"]=Math.floor(quizpersentage)


    const exams = await knex('exam_batches').pluck("examId").where("batchId",batch_id);
    const exam=await knex("exams").pluck("id").whereIn("id",exams).andWhere("is_res_dec",1);
    var tot_exam=exam.length;
    const examresult=await knex("exam_result").select("id").where("stu_id",req.student_id).andWhere("status","pass").whereIn("exam_id",exam);
    var tot_examresult=examresult.length;
    const exampersentage = (tot_examresult/ tot_exam) * 100;
    myperformance["exam"]=Math.floor(exampersentage)

    
    const assignments = await knex('bat_assignments').pluck("assignmentId").where("batchId",batch_id);
    console.log(assignments)
    const assignment=await knex("assignments").pluck("id").whereIn("id",assignments).andWhere("is_res_dec",1);
    console.log(assignment)
    var tot_assignment=assignment.length;
    console.log(tot_assignment)
    const assignmentresult=await knex("assignment_result").pluck("assign_id").where("stu_id",req.student_id).andWhere("status","pass").whereIn("assign_id",assignment);
    console.log(assignmentresult)
    var tot_assignmentresult=assignmentresult.length;
    const assignmentpersentage = (tot_assignmentresult/tot_assignment) * 100;
    console.log(assignmentpersentage)
   
    myperformance["assignment"]=assignmentpersentage;

    res.send({status:1,myperformance})
}

var get_classper_by_status=async(req,res,next)=>{
    const status=req.body.status;
    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    const clas=await knex("classes").pluck("id").where("bat_id",batch_id).andWhere("is_att_dec",1);
    var tot_class=clas.length;
    const attendence=await knex("class_attendence").select("id").where("stu_id",req.student_id).andWhere("attend_status",status).whereIn("class_id",clas);
    var tot_attendence=attendence.length;
    const persentage = (tot_attendence / tot_class) * 100;
    res.send({status:1,persentage})
}


var get_phyclassper_by_status=async(req,res)=>{
    const status=req.body.status;

    const {batch_id,enrollment_id} = await knex('students').select("batch_id","enrollment_id").where("id",req.student_id).first();


    var phy_class_array=knex("attendence").pluck("id").where("user_id",enrollment_id);
    phy_class_array=phy_class_array.length

    var specific_phy_class_array=knex("attendence").pluck("id").where("user_id",enrollment_id).andWhere("status",status);
    specific_phy_class_array=specific_phy_class_array.length

    var phy_att=(specific_phy_class_array/phy_class_array)*100;
    phy_att=Math.floor(phy_att)

 
    res.send({status:1,phy_att})

}

var get_examper_by_status=async(req,res,next)=>{
    const status=req.body.status;
    console.log(status)
    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    const exams = await knex('exam_batches').pluck("examId").where("batchId",batch_id);
    const exam=await knex("exams").select("id").whereIn("id",exams).andWhere("is_res_dec",1);;
    var tot_exam=exam.length;
    const examresult=await knex("exam_result").select("id").where("stu_id",req.student_id).andWhere("status",status);
    var tot_examresult=examresult.length;
    const exampersentage = (tot_examresult/ tot_exam) * 100;
    res.send({status:1,exampersentage})
}

var get_quizper_by_status=async(req,res,next)=>{
    const status=req.body.status;
    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    const quizes = await knex('bat_quizes').pluck("quizId").where("batchId",batch_id);
    const quiz=await knex("quizes").select("id").whereIn("id",quizes);
    var tot_quiz=quiz.length;
    const quizresult=await knex("quiz_result").select("id").where("stu_id",req.student_id).andWhere("status",status);
    var tot_quizresult=quizresult.length;
    const quizpersentage = (tot_quizresult/ tot_quiz) * 100;
    res.send({status:1,quizpersentage})
}

var get_assignmentper_by_status=async(req,res,next)=>{
    const status=req.body.status;
    console.log(status)
    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    const assignments = await knex('bat_assignments').pluck("assignmentId").where("batchId",batch_id);
    const assignment=await knex("assignments").pluck("id").whereIn("id",assignments).andWhere("is_res_dec",1);;
    var tot_assignment=assignment.length;
    const assignmentresult=await knex("assignment_result").select("id").where("stu_id",req.student_id).andWhere("status",status).whereIn("assign_id",assignment);
    var tot_assignmentresult=assignmentresult.length;
    const assignmentpersentage = (tot_assignmentresult/tot_assignment) * 100;
    res.send({status:1,assignmentpersentage})
}

var get_class_by_status=async(req,res,next)=>{
    const status=req.body.status;
   
    const class_id=await knex("class_attendence").pluck("class_id").where("stu_id",req.student_id).andWhere("attend_status",status);
    const clas=await knex("classes").select("*").whereIn("id",class_id);
    res.send({status:1,clas})

}
var get_assignment_by_status=async(req,res,next)=>{
    const status=req.body.status;
    const assignmentresult=await knex("assignment_result").pluck("assign_id").where("stu_id",req.student_id).andWhere("status",status);
    const assign=await knex("assignment").select("*").whereIn("id",assignmentresult);
    res.send({status:1,assign})

}
var get_quiz_by_status=async(req,res,next)=>{
    const status=req.body.status;
    const quizresult=await knex("quiz_result").pluck("quiz_id").where("stu_id",req.student_id).andWhere("status",status);
    const quizes=await knex("quizes").select("*").whereIn("id",quizresult);
    res.send({status:1,quizes})

}
var get_exam_by_status=async(req,res,next)=>{
    const status=req.body.status;
    console.log(status)
    const examresult=await knex("exam_result").pluck("exam_id").where("stu_id",req.student_id).andWhere("status",status);
    const exam=await knex("quizes").select("*").whereIn("id",examresult);
    res.send({status:1,exam})

}

var student_details=async(req,res,next)=>{
    const student_id=req.student_id;

    const stu_data=await knex("students").select("*").where("id",student_id).first();

    res.send({status:1,stu_data})
}
student_details=trycatch(student_details)

get_assignment_by_status=trycatch(get_assignment_by_status);
get_assignmentper_by_status=trycatch(get_assignmentper_by_status);
get_class_by_status=trycatch(get_assignmentper_by_status);
get_classper_by_status=trycatch(get_classper_by_status);
get_exam_by_status=trycatch(get_exam_by_status)
get_examper_by_status=trycatch(get_examper_by_status);
get_quiz_by_status=trycatch(get_quiz_by_status)
get_quizper_by_status=trycatch(get_quizper_by_status)
myperformance=trycatch(myperformance);
get_phyclassper_by_status=trycatch(get_phyclassper_by_status);
module.exports={student_details,get_assignment_by_status,get_assignmentper_by_status,get_classper_by_status,get_exam_by_status,get_examper_by_status,get_quiz_by_status,get_quizper_by_status,myperformance,get_phyclassper_by_status}



