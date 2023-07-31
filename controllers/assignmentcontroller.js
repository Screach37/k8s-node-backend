const knex = require("../db");
const moment= require("moment")
const { trycatch } = require("../error_handler/try_catch_handler");

var read_upcom_assignment=async(req,res)=>{

    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    console.log(batch_id)


    const currenttime = moment().valueOf();
    console.log(currenttime)


    const assignments = await knex('bat_assignments').pluck("assignmentId").where("batchId",batch_id);
    console.log(assignments)

    const assignment =await knex("assignments").select("assignments.id","assignments.assignment_name","assignments.sch_time","assignments.due_time","assignments.sub_id","assignments.sub_name").join('subjects', 'assignments.sub_id', '=', 'subjects.id').where("due_time",">",currenttime).whereIn("assignments.id",assignments)
    
    for(let i of assignment){
        i.sch_time = moment(i.sch_time).format('YYYY-MM-DDTHH:mm:ss');
        i.due_time = moment(i.due_time).format('YYYY-MM-DDTHH:mm:ss');
        
    }
    res.send({status:1,assignment})
}

var read_completed_assignment=async(req,res)=>{

    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    console.log(batch_id)


    const currenttime = moment().valueOf();
    console.log(currenttime)


    const assignments = await knex('bat_assignments').pluck("assignmentId").where("batchId",batch_id);
    console.log(assignments)

    const assignment =await knex("assignments").select('assignments.is_res_dec',"assignments.tot_mark","assignments.id","assignments.assignment_name","assignments.sch_time","assignments.due_time","assignments.sub_id","assignments.sub_name").join('subjects', 'assignments.sub_id', '=', 'subjects.id').where("assignments.due_time","<",currenttime).whereIn("assignments.id",assignments).orderBy('assignments.is_res_dec', 'desc')
    console.log(assignment)
    for(let i of assignment){
        i.sch_time = moment(i.sch_time).format('YYYY-MM-DDTHH:mm:ss');
        i.due_time = moment(i.due_time).format('YYYY-MM-DDTHH:mm:ss');
        console.log(i.id)
        var {marks} = await knex('assignment_result').select("marks").where("stu_id",req.student_id).andWhere("assign_id",i.id).first();
        console.log(marks)
        i["marks"]=marks
        
    }

    res.send({status:1,assignment})
}

var view_upcoming_assignment=async(req,res)=>{
    const {assign_id}=req.body;
    const assignment_det=await knex("assignments").select("instructor_id","sub_name","assignment_name","assignments.due_time","assignments.sch_time").where("id",assign_id).first();
    assignment_det.due_time=moment(assignment_det.due_time).format('YYYY-MM-DDTHH:mm:ss');
    assignment_det.sch_time=moment(assignment_det.sch_time).format('YYYY-MM-DDTHH:mm:ss');

    const assignmnet_res_det=await knex("assignment_result").select("assign_pap","stu_res").where("assign_id",assign_id).andWhere("stu_id",req.student_id).first();

   
    const {name:instructor_name}=await knex ("instructors").select("name").where("id",assignment_det.instructor_id).first()

    const sending={assignment_det,assignmnet_res_det,instructor_name};

    res.send({status:1,sending})
}

var submit_assignment=async(req,res,next)=>{
    const stu_res=req.file.filename;
    const stu_id=req.student_id;
    const {assign_id}=req.body;
    console.log(stu_id,stu_res,assign_id)

  const stat=  await knex('assignment_result')
  .update('stu_res', stu_res).where("assign_id",assign_id).andWhere("stu_id",stu_id);
  res.send({status:1,stat})


}

var view_submit_assignment=async(req,res,next)=>{

    const {assign_id}=req.body;
    const assignment_det=await knex("assignments").select("tot_mark","instructor_id","sub_name","assignment_name","due_time","sch_time").where("id",assign_id).first();
    assignment_det.due_time=moment(assignment_det.due_time).format('YYYY-MM-DDTHH:mm:ss');
    assignment_det.sch_time=moment(assignment_det.sch_time).format('YYYY-MM-DDTHH:mm:ss');

    const assignmnet_res_det=await knex("assignment_result").select("assign_pap","stu_res","marks","status").where("assign_id",assign_id).andWhere("stu_id",req.student_id).first();

   
    const {name:instructor_name}=await knex ("instructors").select("name").where("id",assignment_det.instructor_id).first()

    const sending={assignment_det,assignmnet_res_det,instructor_name};

    res.send({status:1,sending})


}

var view_completed_assignment_undec=async(req,res,next)=>{

    const {assign_id}=req.body;
    const assignment_det=await knex("assignments").select("tot_mark","instructor_id","sub_name","assignment_name","assignments.due_time","assignments.sch_time").where("id",assign_id).first();
    assignment_det.due_time=moment(assignment_det.due_time).format('YYYY-MM-DDTHH:mm:ss');
    assignment_det.sch_time=moment(assignment_det.sch_time).format('YYYY-MM-DDTHH:mm:ss');

    const assignmnet_res_det=await knex("assignment_result").select("assign_pap","stu_res").where("assign_id",assign_id).andWhere("stu_id",req.student_id).first();
    console.log(assignmnet_res_det)

   
    const {name:instructor_name}=await knex ("instructors").select("name").where("id",assignment_det.instructor_id).first()

    const sending={assignment_det,assignmnet_res_det,instructor_name,status:"undeclared"};

    res.send({status:1,sending})


}
view_submit_assignment=trycatch(view_submit_assignment)

submit_assignment=trycatch(submit_assignment)

read_upcom_assignment=trycatch(read_upcom_assignment);
read_completed_assignment=trycatch(read_completed_assignment)
view_upcoming_assignment=trycatch(view_upcoming_assignment)
view_completed_assignment_undec=trycatch(view_completed_assignment_undec)
module.exports={read_upcom_assignment,read_completed_assignment,submit_assignment,view_submit_assignment,view_upcoming_assignment,view_completed_assignment_undec}