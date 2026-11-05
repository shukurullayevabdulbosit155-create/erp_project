import teacherService from "../service/teacher.js"

class TeacherController {

      async createTeacher(req,res,next){
            let resDate = await teacherService.createTeacher(req,res,next)
            return res.status(resDate.status).json(resDate)
      }
}

const teacherController = new TeacherController()
export default teacherController