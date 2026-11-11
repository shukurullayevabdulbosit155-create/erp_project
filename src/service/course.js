import { removeFile, saveFile } from "../utils/file.js" // [YANGI]
import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException } from "../utils/error.js"
import { error } from "console"

class CoursesService{

      async getAllCourses(){

            let courses = await pool.query("select * from courses where purchased=true")

            return{
                  status:200,
                  data:courses.rows
            }
      }

      async getMyCourses(req, res, next) {
    try {
        const teacherId = req.user.id

        const courses = await pool.query(
            `SELECT * FROM courses WHERE teacher_id = $1`,
            [teacherId]
        )

        return {
            status: 200,
            data: courses.rows
        }

    } catch (error) {
        return next(new ErrorException(500, error))
    }
      }

      async getCoursesByCategory(req,res,next){
            try {
                  const {categoryId} = req.params
                  const existCategory = await pool.query(`select id from categories where id=$1`, [categoryId])
                  if(!existCategory.rows.length){
                        return next(new ErrorException(404,"Category not found!"))
                  }

                  const courses = await pool.query(`select * from courses where category_id=$1 and purchased=true`, [categoryId])
                  return{
                        status:200,
                        data:courses.rows
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      async createCourse(req,res,next){
            
            try {

                  const {name,description,level,price,category_id} = req.body
                  const {banner,introVideo} = req.files
                  const teacherId = req.user.id
                  const check_catigory = await pool.query(`select * from categories where id =$1`,[category_id])
                  if(!check_catigory.rows.length){
                         return next(new ErrorException(404,"Category not found"))
                  }
                  
                  const existCourse = await pool.query(`select * from courses where  name=$1`, [name])
                  if(existCourse.rows.length){
                        return next(new ErrorException(409,"Course already exist!"))
                  }


                    if(!banner){
                        return next(new ErrorException(400,"Course banner must be upload"))
                  }

               

                  const fileNameBanner = Date.now() + "." + banner.mimetype.split("/")[1]

                  const allowFileTypes = ["png","jpg", "jpeg", "svg" ]
                  if(!allowFileTypes.includes(banner.mimetype.split("/")[1])){
                        return next(new ErrorException(415,"UnSupportedMediaType"))
                  }




                  banner.mv(process.cwd() + "/src/uploads/banner/" + fileNameBanner, (error)=>{
                        if(error){
                              return next(new ErrorException(500,error))
                        }
                  })

                  let fileNameIntroVideo = null 
                  if(introVideo){

                         fileNameIntroVideo = Date.now() + "." + introVideo.mimetype.split("/")[1]

                        introVideo.mv(process.cwd() + "/src/uploads/introVideo/" + fileNameIntroVideo, (error)=>{ 
                              if(error){
                                    return next(new ErrorException(500,error))
                              }
                        })

                  }
                 
                  await pool.query(`insert into courses(banner, intro_video, name, description, level, price, category_id, teacher_id)

                  values($1, $2, $3, $4, $5, $6, $7, $8)`,

                  [
                  fileNameBanner,
                  fileNameIntroVideo,
                  name,
                  description,
                  level,
                  price,
                  category_id,
                  teacherId
                  ])


                  return{
                        status:201,
                        message: "Course added!"
                  }

            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      async courseApproved(req,next){

            try {
                  
            const {courseId} = req.params

            let course = await pool.query(`select * from courses where id=$1`, [courseId])

            let purchased = course.rows[0].purchased

            await pool.query(`update courses set purchased=${!purchased} where id=$1`, [courseId])

            return{
                  status:200,
                  message: "Course seuccesfully changed"
            }

            } catch (error) {
                 return next(new ErrorException(500,error))
            }

      }

      async updateCourse(req,res,next){
            try {
                  const {courseId} = req.params
                  const {name,description,level,price,category_id} = req.body || {}
                  const {banner,introVideo} = req.files || {}

                  const existCourse = await pool.query(`select * from courses where id=$1`, [courseId])
                  if(!existCourse.rows.length){
                        return next(new ErrorException(404, "Course not found!"))
                  }

                  if(req.user.role == "teacher" && existCourse.rows[0].teacher_id != req.user.id){
                        return next(new ErrorException(403, "You can't update this course!"))
                  }

                  if([name,description,level,price,category_id,banner,introVideo].every(v => v === undefined)){
                        return next(new ErrorException(400, "Nothing to update!"))
                  }

                  if(name){
                        const existName = await pool.query(`select * from courses where name=$1 and id!=$2`, [name, courseId])
                        if(existName.rows.length){
                              return next(new ErrorException(409, "Course already exist!"))
                        }
                  }

                  if(category_id){
                        const existCategory = await pool.query(`select * from categories where id=$1`, [category_id])
                        if(!existCategory.rows.length){
                              return next(new ErrorException(404, "Category not found!"))
                        }
                  }

                  let fileNameBanner = null
                  if(banner){
                        const allowFileTypes = ["png","jpg", "jpeg", "svg" ]
                        if(!allowFileTypes.includes(banner.mimetype.split("/")[1])){
                              return next(new ErrorException(415,"UnSupportedMediaType"))
                        }
                        fileNameBanner = Date.now() + "." + banner.mimetype.split("/")[1]
                        await saveFile("banner", banner, fileNameBanner)
                  }

                  let fileNameIntroVideo = null
                  if(introVideo){
                        fileNameIntroVideo = Date.now() + "." + introVideo.mimetype.split("/")[1]
                        await saveFile("introVideo", introVideo, fileNameIntroVideo)
                  }

                  await pool.query(`update courses set
                        name=coalesce($1,name),
                        description=coalesce($2,description),
                        level=coalesce($3,level),
                        price=coalesce($4,price),
                        category_id=coalesce($5,category_id),
                        banner=coalesce($6,banner),
                        intro_video=coalesce($7,intro_video)
                        where id=$8`,
                  [name, description, level, price, category_id, fileNameBanner, fileNameIntroVideo, courseId])

                  // yangi fayl yuklangan bo'lsa eskisini o'chiramiz
                  if(banner) removeFile("banner", existCourse.rows[0].banner)
                  if(introVideo) removeFile("introVideo", existCourse.rows[0].intro_video)

                  return{
                        status:200,
                        message: "Course updated!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      async deleteCourse(req,res,next){
            try {
                  const {courseId} = req.params

                  const existCourse = await pool.query(`select * from courses where id=$1`, [courseId])
                  if(!existCourse.rows.length){
                        return next(new ErrorException(404, "Course not found!"))
                  }

                  if(req.user.role == "teacher" && existCourse.rows[0].teacher_id != req.user.id){
                        return next(new ErrorException(403, "You can't delete this course!"))
                  }

                  const sections = await pool.query(`select id from sections where course_id=$1 limit 1`, [courseId])
                  if(sections.rows.length){
                        return next(new ErrorException(409, "Course has sections! Delete sections first"))
                  }

                  const students = await pool.query(`select * from studentCourse where course_id=$1 limit 1`, [courseId])
                  if(students.rows.length){
                        return next(new ErrorException(409, "Course has students! You can't delete it"))
                  }

                  await pool.query(`delete from courses where id=$1`, [courseId])

                  removeFile("banner", existCourse.rows[0].banner)
                  removeFile("introVideo", existCourse.rows[0].intro_video)

                  return{
                        status:200,
                        message: "Course deleted!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

}

const coursesService = new CoursesService()
export default coursesService


