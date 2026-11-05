import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException } from "../utils/error.js"

class TeacherService{
      async createTeacher(req,res,next){
            try {

                  const {fullname, phone, password, experience, job, description, portfolio, github, telegram, linkedin} = req.body

                  let hashPass = await argon.hash(password)

                  await pool.query(`insert into teachers(fullname, phone, password, experience, job, description, portfolio, github, telegram, linkedin) 

                  values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,

                  [fullname, phone, hashPass, experience, job, description, portfolio, github, telegram, linkedin])


                  return{
                        status:201,
                        message: "Teacher added!"
                  }

            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }
}

const teacherService = new TeacherService()
export default teacherService