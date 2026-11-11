import { removeFile, saveFile } from "../utils/file.js" // [YANGI]
import { getLessonItem } from "../utils/ownership.js" // [YANGI]
import { ErrorException } from "../utils/error.js"
import pool from "../config/db.js"
import path from "path"


class TaskService {
    constructor() {}

    async getTasksBySectionId(req, res, next) {
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

            

            const tasks = await pool.query(`select * from tasks where lesson_id = $1`, [lessonId])
            return {
                status: 200,
                data: tasks.rows
            }
        } catch (error) {   
            return next(new ErrorException(500, error))
        }
    }

//    async getAllMaterials(req, res, next) {
//     const materials = await pool.query("select id, description, file from materials")

//     return {
//         status: 200,
//         data: materials.rows
//     }
//     }

    async createTask(req, res, next) {

        try {
            let { lesson_id, description } = req.body
            let  file  = req.files ? req.files.file : null

            if (!file) {
                return next(new ErrorException(400, "Lesson file is required!"))
            }

            let fileName = file ? (Date.now() + "." + file.mimetype.split("/")[1]) : null

            let allowFileType = ["pdf", "doc", "docx", "ppt", "pptx","pptx","xls", "xlsx", "text", "jpg", "jpeg", "png", "gif"]

            if (file && !allowFileType.includes(file.mimetype.split("/")[1])) {
                return next(new ErrorException(415, "Unsupported Mediatype"))
            }

          

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

            await pool.query(`insert into tasks(lesson_id, description, file) values($1, $2, $3)`,
            [lesson_id, description, fileName])

           file && file.mv(path.join(process.cwd(), "src", "uploads", "tasks", fileName), err =>{

                    if(err){
                        console.log(err)
                    }

            })

            return {
                status: 201,
                message: "Tasks added!"
            }

        } catch (error) {

            return next(new ErrorException(500, error))

        }
    }

   
    async updateTask(req, res, next) {
        try {
            const { taskId } = req.params
            const { description } = req.body || {}
            const { file } = req.files || {}

            const item = await getLessonItem("tasks", taskId)
            if (!item) {
                return next(new ErrorException(404, "Task not found!"))
            }

            if (req.user.role == "teacher" && item.teacher_id != req.user.id) {
                return next(new ErrorException(403, "You can't update this task!"))
            }

            if (description === undefined && !file) {
                return next(new ErrorException(400, "Nothing to update!"))
            }

            let fileName = null
            if (file) {
                const allowFileType = ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "text", "jpg", "jpeg", "png", "gif"]
                if (!allowFileType.includes(file.mimetype.split("/")[1])) {
                    return next(new ErrorException(415, "Unsupported Mediatype"))
                }
                fileName = Date.now() + "." + file.mimetype.split("/")[1]
                await saveFile("tasks", file, fileName)
            }

            await pool.query(`update tasks set
                description = coalesce($1, description),
                file = coalesce($2, file)
                where id = $3`,
                [description, fileName, taskId])

            if (file) removeFile("tasks", item.file)

            return {
                status: 200,
                message: "Task updated!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteTask(req, res, next) {
        try {
            const { taskId } = req.params

            const item = await getLessonItem("tasks", taskId)
            if (!item) {
                return next(new ErrorException(404, "Task not found!"))
            }

            if (req.user.role == "teacher" && item.teacher_id != req.user.id) {
                return next(new ErrorException(403, "You can't delete this task!"))
            }

            await pool.query(`delete from tasks where id = $1`, [taskId])

            removeFile("tasks", item.file)

            return {
                status: 200,
                message: "Task deleted!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
 
}

let taskService = new TaskService()

export default taskService 
