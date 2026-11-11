import teacherService from "../service/teacher.js"

class TeacherController {
      async getAllTeachers(req,res,next){
            let resDate = await teacherService.getAllTeachers(req,res,next)
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }
      }

      async createTeacher(req,res,next){
            let resDate = await teacherService.createTeacher(req,res,next)
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }
      }
      async updateTeacher(req,res,next){
            let resDate = await teacherService.updateTeacher(req,res,next)
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }
      }

     
      async deleteTeacher(req,res,next){
            let resDate = await teacherService.deleteTeacher(req,res,next)
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }
      }
}

const teacherController = new TeacherController()
export default teacherController
