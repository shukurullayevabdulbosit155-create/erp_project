import { getCourseBySectionId } from "../utils/ownership.js" // [YANGI]
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class SectionsService{

      async getAllSections(){

            let sections = await pool.query("select id, name from sections where status='active' ")

            return{
                  status:200,
                  data:sections.rows
            }
      }

      
      async getSections(req,next){

            const {courseId} = req.params
            
            

            let course = await pool.query("select * from courses where id=$1",[+courseId])

           

            if(!course.rows.length){
                  return next(new ErrorException(404, "Course not found"))
            }

            if(req.user.role == "teacher" &&  course.rows[0].teacher_id !==  req.user.id){
                  return next(new ErrorException(403, "You can't add section this course"))
            }

            if(req.user.role == "student"){

            let studentCourse = await pool.query("select * from studentCourse where student_id=$1",[req.user.id])

            if(studentCourse.rows[0].course_id != courseId){
                  
            return next(new ErrorException(403, "You can't add section this course"))
            
            }

            }

            let sections = await pool.query("section id, name from sections where course_id=$1", [courseId])

            return{
                  status:200,
                  data:sections.rows
            }
      }

      async createSection(req,res,next){
            try {

                  const {name, course_id} = req.body

                  

                  const existName = await pool.query(`select * from sections where name=$1`, [name])


                  if(existName.rows.length){
                        return next(new ErrorException(409, "Section already exist!"))
                  }


                  const existCourse = await pool.query(`select * from courses where id=$1`, [course_id])
                  
                  if(!existCourse.rows.length){
                        return next(new ErrorException(404, "Course Not Found!"))
                  }

                  if(existCourse.rows[0].teacher_id != req.user.id){
                        return next(new ErrorException(403, "You can`t add section this course"))
                  }

                  if(existCourse.rows[0].status !== "active" ){
                        return next(new ErrorException(400, "Course is not active"))
                  }

                  await pool.query(`insert into sections(name, course_id) 

                  values($1,$2)`,

                  [name,course_id])


                  return{
                        status:201,
                        message: "Section added!"
                  }

            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }


      async updateSection(req,res,next){
            try {
                  const {sectionId} = req.params
                  const {name} = req.body || {}

                  const course = await getCourseBySectionId(sectionId)
                  if(!course){
                        return next(new ErrorException(404, "Section not found!"))
                  }

                  if(req.user.role == "teacher" && course.teacher_id != req.user.id){
                        return next(new ErrorException(403, "You can't update this section!"))
                  }

                  const existName = await pool.query(`select * from sections where name=$1 and id!=$2`, [name, sectionId])
                  if(existName.rows.length){
                        return next(new ErrorException(409, "Section already exist!"))
                  }

                  await pool.query(`update sections set name=$1 where id=$2`, [name, sectionId])

                  return{
                        status:200,
                        message: "Section updated!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      async deleteSection(req,res,next){
            try {
                  const {sectionId} = req.params

                  const course = await getCourseBySectionId(sectionId)
                  if(!course){
                        return next(new ErrorException(404, "Section not found!"))
                  }

                  if(req.user.role == "teacher" && course.teacher_id != req.user.id){
                        return next(new ErrorException(403, "You can't delete this section!"))
                  }

                  const lessons = await pool.query(`select id from lessons where section_id=$1 limit 1`, [sectionId])
                  if(lessons.rows.length){
                        return next(new ErrorException(409, "Section has lessons! Delete lessons first"))
                  }

                  await pool.query(`delete from sections where id=$1`, [sectionId])

                  return{
                        status:200,
                        message: "Section deleted!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }
}

const sectionsService = new SectionsService()
export default sectionsService

