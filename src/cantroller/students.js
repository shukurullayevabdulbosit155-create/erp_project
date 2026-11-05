import studentService from "../service/students.js"

class StudentController {
  
      async getAllStudents(req,res,next){

            let resDate = await studentService.getAllStudents()
            return res.status(resDate.status).json(resDate)

      }

      async createStudent(req,res,next){

            let resDate = await studentService.createStudent(req,res,next)
           
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }
}

const studentController = new StudentController()
export default studentController