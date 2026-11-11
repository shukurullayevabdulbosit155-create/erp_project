import coursesService from "../service/course.js"

class CoursesController {
  
      async getAllCourses(req,res,next){

            let resDate = await coursesService.getAllCourses()
            return res.status(resDate.status).json(resDate)

      }

      async getCoursesByCategory(req,res,next){
            let resDate = await coursesService.getCoursesByCategory(req,res,next)
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }
      }

      async getMyCourses(req, res, next) {
      let resDate = await coursesService.getMyCourses(req, res, next)

      if (resDate) {
            return res.status(resDate.status).json(resDate)
      }
       }

      async createCourse(req,res,next){

            let resDate = await coursesService.createCourse(req,res,next)
           
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

      async courseApproved(req,res,next){

      let resDate = await coursesService.courseApproved(req,next)
           
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }


      async updateCourse(req,res,next){

            let resDate = await coursesService.updateCourse(req,res,next)

            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

      async deleteCourse(req,res,next){

            let resDate = await coursesService.deleteCourse(req,res,next)

            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

      

     
}

const coursesController = new CoursesController()
export default coursesController