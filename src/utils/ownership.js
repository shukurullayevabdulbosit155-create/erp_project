import pool from "../config/db.js"

export async function getCourseBySectionId(sectionId) {
    const result = await pool.query(
        `select c.id as course_id, c.teacher_id
         from sections s
         inner join courses c on s.course_id = c.id
         where s.id = $1`, [sectionId])
    return result.rows[0] || null
}

export async function getCourseByLessonId(lessonId) {
    const result = await pool.query(
        `select c.id as course_id, c.teacher_id
         from lessons l
         inner join sections s on l.section_id = s.id
         inner join courses c on s.course_id = c.id
         where l.id = $1`, [lessonId])
    return result.rows[0] || null
}

export async function getLessonItem(table, id) {
    const allowed = ["materials", "tasks", "exams"]
    if (!allowed.includes(table)) throw new Error("Invalid table name")

    const result = await pool.query(
        `select i.*, c.teacher_id
         from ${table} i
         inner join lessons l on i.lesson_id = l.id
         inner join sections s on l.section_id = s.id
         inner join courses c on s.course_id = c.id
         where i.id = $1`, [id])
    return result.rows[0] || null
}
