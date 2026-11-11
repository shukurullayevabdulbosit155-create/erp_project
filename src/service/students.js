import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException } from "../utils/error.js"

class StudentService{

      async getAllStudents(){

            let students = await pool.query("select id,fullname,phone,photo,created_at, status from students")

            return{
                  status:200,
                  data:students.rows
            }
      }


      async getAllMyCourses(req, next) {
      try {
            let studentId = req.user.id

            const course = await pool.query(`
                  SELECT 
                  c.id,
                  c.name,
                  c.banner,
                  t.fullname,
                  t.photo
                  FROM studentCourse sc
                  INNER JOIN courses c ON sc.course_id = c.id
                  INNER JOIN staff t ON c.teacher_id = t.id
                  WHERE sc.student_id = $1
            `, [studentId])

            return{
                  status:200,
                  date:course.rows
            }

      } catch (error) {
            next(new ErrorException(500, error))
      }
      }

      async createStudent(req,res,next){
            try {

                  const {fullName, phone, password} = req.body
 
                  let hashPass = await argon.hash(password)

                 let student =  await pool.query(`insert into students(fullname, phone, password) 

                  values($1, $2, $3) RETURNING id`,

                  [fullName, phone, hashPass])

                  // let studentId = student.rows[0].id

                  // await pool.query(`insert into studentCourse(student_id,course_id) values($1,$2)`, [studentId,course_id])

                  return{
                        status:201,
                        message: "Student added and course purchased"
                  }

            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      async updateStudent(req,res,next){
            try {
                  const {studentId} = req.params
                  const {fullName, phone, password} = req.body || {}

                  const existStudent = await pool.query(`select * from students where id=$1`, [studentId])
                  if(!existStudent.rows.length){
                        return next(new ErrorException(404, "Student not found!"))
                  }

                  if([fullName, phone, password].every(v => v === undefined)){
                        return next(new ErrorException(400, "Nothing to update!"))
                  }

                  if(phone){
                        const existPhone = await pool.query(`select * from students where phone=$1 and id!=$2`, [phone, studentId])
                        if(existPhone.rows.length){
                              return next(new ErrorException(409, "Student with this phone already exist!"))
                        }
                  }

                  let hashPass = null
                  if(password){
                        hashPass = await argon.hash(password)
                  }

                  await pool.query(`update students set
                        fullname=coalesce($1,fullname),
                        phone=coalesce($2,phone),
                        password=coalesce($3,password)
                        where id=$4`,
                  [fullName, phone, hashPass, studentId])

                  return{
                        status:200,
                        message: "Student updated!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      
      async deleteStudent(req,res,next){
            try {
                  const {studentId} = req.params

                  const existStudent = await pool.query(`select * from students where id=$1`, [studentId])
                  if(!existStudent.rows.length){
                        return next(new ErrorException(404, "Student not found!"))
                  }

                  await pool.query(`update students set status='inactive' where id=$1`, [studentId])

                  return{
                        status:200,
                        message: "Student deleted!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      async purchaseCourse(req, res, next) {
      try {
            const studentId = req.user.id
            const { course_id } = req.body

            const course = await pool.query(
                  `SELECT id FROM courses WHERE id=$1 AND status='active'`,
                  [course_id]
            )

            if (!course.rows.length) {
                  return next(new ErrorException(404, "Course not found!"))
            }

            const existCourse = await pool.query(
                  `SELECT * FROM studentCourse WHERE student_id=$1 AND course_id=$2`,
                  [studentId, course_id]
            )

            if (existCourse.rows.length) {
                  return next(new ErrorException(409, "Course already purchased!"))
            }

            await pool.query(
                  `INSERT INTO studentCourse(student_id, course_id) VALUES($1, $2)`,
                  [studentId, course_id]
            )

            return {
                  status: 201,
                  message: "Course purchased successfully!"
            }

      } catch (error) {
            return next(new ErrorException(500, error))
      }
      }

}

const studentService = new StudentService()
export default studentService