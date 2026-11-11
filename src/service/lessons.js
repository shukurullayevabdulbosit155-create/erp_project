import { removeFile, saveFile } from "../utils/file.js" // [YANGI]
import { getCourseByLessonId, getCourseBySectionId } from "../utils/ownership.js" // [YANGI]
import { ErrorException } from "../utils/error.js"
import pool from "../config/db.js"

class LessonService {
    constructor() { }

    async getLessonsBySectionId(req, res, next) {
        try {
            const { sectionId } = req.params

            let existSection = await pool.query(`select * from sections where id=$1`, [sectionId])

            if (!existSection.rows.length) {
                return next(new ErrorException(404, "Section not found!"))
            }

            let course = await pool.query(`select * from courses where id = $1`, [existSection.rows[0].course_id])
            if (!course.rows.length) {
                return next(new ErrorException(404, "Course not found"))
            }

           if (req.user.role == "teacher" && Number(course.rows[0].teacher_id) !== Number(req.user.id)) {
    return next(new ErrorException(403, "You can't view this section!"))
}

            const lessons = await pool.query(`select * from lessons where section_id = $1`, [sectionId])
            return {
                status: 200,
                data: lessons.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    
    async getAllLessons(req, res, next) {
        try {
            const lessons = await pool.query(`select * from lessons`)
            return {
                status: 200,
                data: lessons.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createLesson(req, res, next) {
        try {
            let { name, section_id, description } = req.body
            let { file } = req.files || {}

            if (!file) {
                return next(new ErrorException(400, "Lesson file is required!"))
            }

            let fileName = Date.now() + "." + file.mimetype.split("/")[1]
            let allowFileType = ["mp4", "mov", "webm", "avi", "ogm"]

            if (!allowFileType.includes(file.mimetype.split("/")[1])) {
                return next(new ErrorException(415, "Unsupported Mediatype"))
            }

            let exitsName = await pool.query(`select * from lessons where name = $1`, [name])
            if (exitsName.rows.length) {
                return next(new ErrorException(409, "Lesson already exist!"))
            }

            let existSection = await pool.query(`select * from sections where id = $1`, [section_id])
            if (!existSection.rows.length) {
                return next(new ErrorException(404, "Section not found!"))
            }
            let courseId = existSection.rows[0].course_id

            let teacher = await pool.query(`select teacher_id from courses where id = $1`, [courseId])

            if (!teacher.rows.length) {
                return next(new ErrorException(404, "Course not found!"))
            }

            if (teacher.rows[0].teacher_id != req.user.id) {
                return next(new ErrorException(403, "You cant add lesson to this section!"))
            }

            if (existSection.rows[0].status != "active") {
                return next(new ErrorException(400, "Section is not active!"))
            }

            await file.mv(process.cwd() + "/src/uploads/lessons_file/" + fileName, (error) => {
                if (error) {
                    return next(new ErrorException(500, error))
                }
            })

            await pool.query(`insert into lessons(section_id, name, description, file) values($1, $2, $3, $4)`,
                [section_id, name, description, fileName])

            return {
                status: 201,
                message: "Lesson added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }


    async updateLesson(req, res, next) {
        try {
            const { lessonId } = req.params
            const { name, description, section_id } = req.body || {}
            const { file } = req.files || {}

            const existLesson = await pool.query(`select * from lessons where id = $1`, [lessonId])
            if (!existLesson.rows.length) {
                return next(new ErrorException(404, "Lesson not found!"))
            }

            const course = await getCourseByLessonId(lessonId)
            if (!course) {
                return next(new ErrorException(404, "Section or course not found!"))
            }

            if (req.user.role == "teacher" && course.teacher_id != req.user.id) {
                return next(new ErrorException(403, "You can't update this lesson!"))
            }

            if ([name, description, section_id, file].every(v => v === undefined)) {
                return next(new ErrorException(400, "Nothing to update!"))
            }

            if (name) {
                const existName = await pool.query(`select * from lessons where name = $1 and id != $2`, [name, lessonId])
                if (existName.rows.length) {
                    return next(new ErrorException(409, "Lesson already exist!"))
                }
            }

            // boshqa section'ga ko'chirilsa, u ham shu teacher'ning kursiga tegishli bo'lishi kerak
            if (section_id) {
                const newCourse = await getCourseBySectionId(section_id)
                if (!newCourse) {
                    return next(new ErrorException(404, "Section not found!"))
                }
                if (req.user.role == "teacher" && newCourse.teacher_id != req.user.id) {
                    return next(new ErrorException(403, "You can't move lesson to this section!"))
                }
            }

            let fileName = null
            if (file) {
                const allowFileType = ["mp4", "mov", "webm", "avi", "ogm"]
                if (!allowFileType.includes(file.mimetype.split("/")[1])) {
                    return next(new ErrorException(415, "Unsupported Mediatype"))
                }
                fileName = Date.now() + "." + file.mimetype.split("/")[1]
                await saveFile("lessons_file", file, fileName)
            }

            await pool.query(`update lessons set
                name = coalesce($1, name),
                description = coalesce($2, description),
                section_id = coalesce($3, section_id),
                file = coalesce($4, file)
                where id = $5`,
                [name, description, section_id, fileName, lessonId])

            if (file) removeFile("lessons_file", existLesson.rows[0].file)

            return {
                status: 200,
                message: "Lesson updated!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteLesson(req, res, next) {
        try {
            const { lessonId } = req.params

            const existLesson = await pool.query(`select * from lessons where id = $1`, [lessonId])
            if (!existLesson.rows.length) {
                return next(new ErrorException(404, "Lesson not found!"))
            }

            const course = await getCourseByLessonId(lessonId)
            if (!course) {
                return next(new ErrorException(404, "Section or course not found!"))
            }

            if (req.user.role == "teacher" && course.teacher_id != req.user.id) {
                return next(new ErrorException(403, "You can't delete this lesson!"))
            }

            const children = await pool.query(
                `select
                    (select count(*) from materials where lesson_id = $1) as materials,
                    (select count(*) from tasks where lesson_id = $1) as tasks,
                    (select count(*) from exams where lesson_id = $1) as exams`, [lessonId])

            const c = children.rows[0]
            if (Number(c.materials) || Number(c.tasks) || Number(c.exams)) {
                return next(new ErrorException(409, "Lesson has materials, tasks or exams! Delete them first"))
            }

            await pool.query(`delete from lessons where id = $1`, [lessonId])

            removeFile("lessons_file", existLesson.rows[0].file)

            return {
                status: 200,
                message: "Lesson deleted!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

}

let lessonService = new LessonService()

export default lessonService