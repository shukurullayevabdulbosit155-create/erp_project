import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException } from "../utils/error.js"

class TeacherService{
      async getAllTeachers(req,res,next){
            try {
                  // SHU YER O'ZGARTIRILDI: bazada teachers jadvali yo'q, teacherlar staff jadvalida role='teacher' bilan saqlanadi.
                  const teachers = await pool.query(`select id, fullname, phone, photo, role, status, create_at from staff where role=$1`, ["teacher"])

                  return{
                        status:200,
                        data:teachers.rows
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      async createTeacher(req,res,next){
            try {
                  const {fullname, phone, password} = req.body

                  const existTeacher = await pool.query(`select id from staff where phone=$1`, [phone])
                  if(existTeacher.rows.length){
                        return next(new ErrorException(409,"Teacher with this phone already exist!"))
                  }

                  let hashPass = await argon.hash(password)

                  await pool.query(`insert into staff(fullname, phone, password, role) values($1, $2, $3, $4)`,
                        [fullname, phone, hashPass, "teacher"])

                  return{
                        status:201,
                        message: "Teacher added!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      async updateTeacher(req,res,next){
            try {
                  const {teacherId} = req.params
                  const {fullname, phone, password} = req.body || {}

                  // SHU YER O'ZGARTIRILDI: faqat staff ichidagi teacher roliga ega foydalanuvchi yangilanadi.
                  const existTeacher = await pool.query(`select * from staff where id=$1 and role=$2`, [teacherId, "teacher"])
                  if(!existTeacher.rows.length){
                        return next(new ErrorException(404,"Teacher not found!"))
                  }

                  if([fullname, phone, password].every(value => value === undefined)){
                        return next(new ErrorException(400,"Nothing to update!"))
                  }

                  if(phone){
                        const existPhone = await pool.query(`select id from staff where phone=$1 and id!=$2`, [phone, teacherId])
                        if(existPhone.rows.length){
                              return next(new ErrorException(409,"Phone already exist!"))
                        }
                  }

                  let hashPass = null
                  if(password){
                        hashPass = await argon.hash(password)
                  }

                  await pool.query(`update staff set
                        fullname=coalesce($1,fullname),
                        phone=coalesce($2,phone),
                        password=coalesce($3,password)
                        where id=$4 and role=$5`,
                        [fullname, phone, hashPass, teacherId, "teacher"])

                  return{
                        status:200,
                        message:"Teacher updated!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      async deleteTeacher(req,res,next){
            try {
                  const {teacherId} = req.params

                  // SHU YER O'ZGARTIRILDI: teacher staff jadvalidan o'chirilmaydi, status inactive qilinadi.
                  const existTeacher = await pool.query(`select id from staff where id=$1 and role=$2`, [teacherId, "teacher"])
                  if(!existTeacher.rows.length){
                        return next(new ErrorException(404,"Teacher not found!"))
                  }

                  const courses = await pool.query(`select id from courses where teacher_id=$1 limit 1`, [teacherId])
                  if(courses.rows.length){
                        return next(new ErrorException(409,"Teacher has courses! Reassign courses first"))
                  }

                  await pool.query(`update staff set status=$1 where id=$2 and role=$3`, ["inactive", teacherId, "teacher"])

                  return{
                        status:200,
                        message:"Teacher deleted!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }
}

const teacherService = new TeacherService()
export default teacherService
