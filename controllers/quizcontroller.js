const knex = require("../db");
const { trycatch } = require("../error_handler/try_catch_handler");
const moment=require("moment")

var get_upcom_quiz=async(req,res,next)=>{
    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    console.log(batch_id)


    const currenttime = moment().valueOf();
    console.log(currenttime)


    const quizes = await knex('bat_quizes').pluck("quizId").where("batchId",batch_id);
    console.log(quizes)

    const quiz =await knex("quizes").select("passingpersentage","title","start_time","end_time","subjectname","id").where("history",">",currenttime).whereIn("id",quizes)
    
    for(let i of quiz){
        i.start_time = moment(i.start_time).format('YYYY-MM-DDTHH:mm:ss');
        i.end_time = moment(i.end_time).format('YYYY-MM-DDTHH:mm:ss');
        
    }
    res.send({status:1,quiz})
}
var view_upcom_quiz=async(req,res,next)=>{
    const{quiz_id}=req.body
    const quiz =await knex("quizes").select("timeperiod","subjectname","tagwithpersentage","numberofquestion","timeperquestion","passingpersentage","quizrules","timeperiod").where("id",quiz_id).first();
var tags=[]

quiz.tagwithpersentage=JSON.parse(quiz.tagwithpersentage)
console.log(quiz.tagwithpersentage)
    for(let i in quiz.tagwithpersentage){
        console.log(i)

        const {topic_name}= await knex("topics").select("topic_name").where({id:i}).first()

        tags=[...tags,topic_name]

    }
    
    res.send({status:1,quiz,tags})
}
var get_completed_quiz=async(req,res,next)=>{
    const {batch_id} = await knex('students').select("batch_id").where("id",req.student_id).first();
    console.log(batch_id)


    const currenttime = moment().valueOf();
    console.log(currenttime)


    const quizes = await knex('bat_quizes').pluck("quizId").where("batchId",batch_id);
    console.log(quizes)

    const quiz =await knex("quizes").select("passingpersentage","title","start_time","end_time","subjectname","id").where("history","<",currenttime).whereIn("id",quizes)
    
    for(let i of quiz){
        i.start_time = moment(i.start_time).format('YYYY-MM-DDTHH:mm:ss');
        i.end_time = moment(i.end_time).format('YYYY-MM-DDTHH:mm:ss');
        
    }
    res.send({status:1,quiz})
}

var view_completed_quiz=async(req,res,next)=>{

    const {quiz_id}=req.body;

    const quiz=await knex("quiz_result").select("submit_timeperiod","marks","status").where("quiz_id",quiz_id).andWhere("stu_id",req.studentid).first();
     

    const ranks=await knex("quiz_result").pluck("stu_id").where("quiz_id",quiz_id).orderBy([{ column: 'marks', order: 'desc' }, { column: 'submit_timeperiod', order: 'asc' }])
    
    var rank=ranks.indexOf(req.student_id)+1;
    quiz["rank"]=rank

    const top_ranks=await knex("quiz_result").select("stu_id","stu_name","marks","submit_time").where("quiz_id",quiz_id).orderBy([{ column: 'marks', order: 'desc' }, { column: 'submit_timeperiod', order: 'asc' }]).limit(3)

    const scoreboard=await knex("quiz_result").select("stu_id","stu_name","marks","submit_time").where("quiz_id",quiz_id).orderBy([{ column: 'marks', order: 'desc' }, { column: 'submit_timeperiod', order: 'asc' }])

    res.send({status:1,quiz,top_ranks,scoreboard})

}

var triveaquiz = async (req, res) => {
   
      var { quiz_id } = req.body;
      var stu_id=req.student_id
       
      const{start_time:st,history:hs} = await knex('quizes').select('start_time', 'history').where('id', quiz_id).first();
  
      const currenttim=moment().valueOf();
  
    //   if(currenttim<st || currenttim>hs){
  
    //     return res.send({status:0,msg:"wait for schedule time" })
    //   }
  
  
  
  
      const query = await knex('quizes').select('tagwithpersentage', 'passingpersentage', 'numberofquestion').where('id', quiz_id).first();
      query.tagwithpersentage = JSON.parse(query.tagwithpersentage);
      const { tagwithpersentage, passingpersentage, numberofquestion } = query;
      let question_arr = [];
      let ans_arr = [];
      console.log(tagwithpersentage)
      for (let i in tagwithpersentage) {
        // console.log(i)
        const persentage = tagwithpersentage[i];
        // console.log(persentage);
        const single_tag_quest = (numberofquestion / 100) * persentage;
        //  console.log(single_tag_quest)
  
  
        const que = await knex('questionbanks').select('id', 'ans').where('topic_id', i).orderByRaw('RAND()')
          .limit(single_tag_quest);
        for (let i of que) {
          question_arr = [...question_arr, i.id];
          ans_arr = [...ans_arr, i.ans]
        }
      }
      console.log(question_arr)
      question_arr = JSON.stringify(question_arr)
      console.log(question_arr)
      ans_arr = JSON.stringify(ans_arr)
      console.log(ans_arr);

      var questions=[]
  
      
      var ai =await knex('quiz_ai').insert({ questions_ar: question_arr, cor_ans_ar: ans_arr, stu_id, quiz_id,created_at:new Date() ,updated_at:new Date()}) .returning('id');
      question_arr=JSON.parse(question_arr);
      for(let i of question_arr){
        const question=await knex("questionbanks").select("question","options").where("id",i).first()
        questions=[...questions,question]
      }
      res.send({status:1,ai,questions});

    }

    var stu_res_quiz = async (req, res) => {
       
          var { quiz_aiid, ans_arr ,submit_timeperiod} = req.body;
          ans_arr = JSON.stringify(ans_arr)
          // const validatedData = await quiz_ai.validate({ stu_ans_ar: ans_arr })
          // const data = await quiz_ai.query().findById(quiz_aiid)
          //   .patch(validatedData);
          await knex('quiz_ai')
          .where({ id: quiz_aiid }) // Replace with your condition
          .update({ stu_ans_ar: ans_arr });
      
      
          let marks = 0;
          var { cor_ans_ar, stu_ans_ar, quiz_id, stu_id } = await knex('quiz_ai').select('cor_ans_ar', 'stu_ans_ar', 'quiz_id', 'stu_id').where('id', quiz_aiid).first();
          const stu_ans = JSON.parse(stu_ans_ar)
          cor_ans_ar = JSON.parse(cor_ans_ar)
      
          var correct=0;
          var unattempt=0;
          var incorrect=0;
      
          for (let i in stu_ans) {
      
            if (stu_ans[i] == cor_ans_ar[i]) {
              marks++;
              correct++
            }
            else if(stu_ans[i] == -1){
              unattempt++
            }
            else{
              incorrect++
            }
          }
          marks *= 4;
          const { numberofquestion, passingpersentage } = await knex('quizes').select('numberofquestion', 'passingpersentage').where('id', quiz_id).first();
          const totalmarks = 4 * numberofquestion;
          const persentage = (marks / totalmarks) * 100;
          console.log(persentage)
          console.log(passingpersentage)
          if (persentage >= passingpersentage) {
            // console.log("in if")
            // console.log(marks);
            // console.log()
            // const validatedDat = await quiz_result.validate({ marks, status: "pass" })
            // console.log(validatedDat)
           const ai= await knex('quiz_result')
            .where({ quiz_id: quiz_id,stu_id:stu_id }) // Replace with your condition
            .update({ marks, status: "pass",submit_timeperiod:submit_timeperiod});
      
      
            res.send({message:"result declare successfuly",correct,incorrect,unattempt});
          }
          else {
            // const validatedDat = await quiz_result.validate({ marks, status: "fail" })
            const ai= await knex('quiz_result')
            .where({ quiz_id: quiz_id,stu_id:stu_id }) // Replace with your condition
            .update({ marks, status: "fail",submit_timeperiod:submit_timeperiod});
            res.send({message:"result declare successfuly",correct,incorrect,unattempt});
          }
      
      
          // res.send("sucessfuly result declared");
      
      
      
        
      }

get_completed_quiz=trycatch(get_completed_quiz);
view_completed_quiz=trycatch(view_completed_quiz);
view_upcom_quiz=trycatch(view_upcom_quiz);
get_upcom_quiz=trycatch(get_upcom_quiz);
triveaquiz=trycatch(triveaquiz);
stu_res_quiz=trycatch(stu_res_quiz);

module.exports={get_completed_quiz,view_completed_quiz,view_upcom_quiz,get_upcom_quiz,triveaquiz,stu_res_quiz}
