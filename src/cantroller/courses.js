import coursesService from "../service/course.js"

class CoursesController {
  
      async getAllCourses(req,res,next){

            let resDate = await coursesService.getAllCourses()
            return res.status(resDate.status).json(resDate)

      }

      async createCourse(req,res,next){

            let resDate = await coursesService.createCourse(req,res,next)
           
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }
}

const coursesController = new CoursesController()
export default coursesController