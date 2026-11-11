import { getLessonItem } from "../utils/ownership.js" // [YANGI]
import { ErrorException } from "../utils/error.js"
import pool from "../config/db.js"
import path from "path"


class ExamsService {
    constructor() {}

    async getExamsBySectionId(req, res, next) {
        try {
            const { lessonId } = req.params

            let existSection = await pool.query(`select * from lessons where id=$1`, [lessonId])

            if (!existSection.rows.length) {
               return next(new ErrorException(404, "Lesson not found!"))
            }

            const sectionId = existSection.rows[0].section_id
            if(!sectionId){
                return next(new ErrorException(400, "Lesson does not belong to any  section!"))
            }

            
            const sections = await pool.query("select * from sections where id=$1", [sectionId])
           if (!sections.rows.length) {
                return next(new ErrorException(404, "Section is not Found!"))
            }


            let course = await pool.query(`select * from courses where id = $1`, [sections.rows[0].course_id])
            if (!course.rows.length) {
                return next(new ErrorException(404, "Course not found"))
            }

            if (req.user.role == "teacher" && course.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "You do not have access to this taks!"))
            }


            if (req.user.role === "student") {
            const purchased = await pool.query(
                `SELECT * FROM studentCourse
                WHERE student_id = $1 AND course_id = $2`,
                [req.user.id, course.rows[0].id]
            )

            if (!purchased.rows.length) {
                return next(new ErrorException(403, "You have not purchased this course!"))
            }
        }

            

            const exmas = await pool.query(`select * from exams where lesson_id = $1`, [lessonId])
            return {
                status: 200,
                data: exmas.rows
            }
        } catch (error) {   
            return next(new ErrorException(500, error))
        }
    }

    
    async createExam(req, res, next) {

        try {
            let { lesson_id,  question, variantA,variantB,variantC,variantD, answer} = req.body
      

            let existLesson = await pool.query(`select * from lessons where id = $1`, [lesson_id])

          

           if(!existLesson.rows.length){
               return next(new ErrorException(404, "Lesson not found!"))
             }

            let sectionId = existLesson.rows[0].section_id

            const courseId = await pool.query(
            `select course_id from sections where id = $1`,
            [sectionId]
            )
            if(!courseId.rows.length){
                return next(new ErrorException(404, "Section not found!"))
            }

            let teacher = await pool.query(
                `select teacher_id from courses where id = $1`,
                [courseId.rows[0].course_id]
            )
     
            if (req.user.role === "teacher" && teacher.rows[0].teacher_id != req.user.id) {
                return next(new ErrorException(403, "You cant add tasks to this section!"))
            }

            await pool.query(`insert into exams(lesson_id,  question,variantA,variantB,variantC,variantD, answer) values($1, $2, $3, $4, $5, $6, $7 )`,
            [lesson_id, question, variantA,variantB,variantC,variantD, answer])


            return {
                status: 201,
                message: "Exam added!"
            }

        } catch (error) {

            return next(new ErrorException(500, error))

        }
    }

    async updateExam(req, res, next) {
        try {
            const { examId } = req.params
            const { question, variantA, variantB, variantC, variantD, answer } = req.body || {}

            const exam = await getLessonItem("exams", examId)
            if (!exam) {
                return next(new ErrorException(404, "Exam not found!"))
            }

            if (req.user.role == "teacher" && exam.teacher_id != req.user.id) {
                return next(new ErrorException(403, "You can't update this exam!"))
            }

            if ([question, variantA, variantB, variantC, variantD, answer].every(v => v === undefined)) {
                return next(new ErrorException(400, "Nothing to update!"))
            }

            await pool.query(`update exams set
                question = coalesce($1, question),
                variantA = coalesce($2, variantA),
                variantB = coalesce($3, variantB),
                variantC = coalesce($4, variantC),
                variantD = coalesce($5, variantD),
                answer = coalesce($6, answer)
                where id = $7`,
                [question, variantA, variantB, variantC, variantD, answer, examId])

            return {
                status: 200,
                message: "Exam updated!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteExam(req, res, next) {
        try {
            const { examId } = req.params

            const exam = await getLessonItem("exams", examId)
            if (!exam) {
                return next(new ErrorException(404, "Exam not found!"))
            }

            if (req.user.role == "teacher" && exam.teacher_id != req.user.id) {
                return next(new ErrorException(403, "You can't delete this exam!"))
            }

            await pool.query(`delete from exams where id = $1`, [examId])

            return {
                status: 200,
                message: "Exam deleted!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

}

let examsService = new ExamsService()

export default examsService 
