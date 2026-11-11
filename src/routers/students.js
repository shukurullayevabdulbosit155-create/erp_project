import express from  "express"
const router = express.Router()
import coursesController from "../cantroller/courses.js"
import studentsController from "../cantroller/students.js"
import  middleware from "../midllewere/validation.js"
import { roleGuard } from "../guards/role.guard.js"
import { authGuard } from "../guards/auth.guard.js"


router
  

      .get("/students", authGuard ,roleGuard("admin"), studentsController.getAllStudents)

      router.post("/students/purchase",authGuard, roleGuard("student"),middleware.purchaseCourse,studentsController.purchaseCourse)
      
      .get("/students/my/courses", authGuard ,roleGuard("student"), studentsController.getAllMyCourses)

      .get("/courses/my", authGuard, roleGuard("teacher"), coursesController.getMyCourses)

      .post("/students",middleware.createStudent, studentsController.createStudent)

      

    
      router.post("/students/purchase", authGuard, roleGuard("student"), studentsController.purchaseCourse)

      .put("/students/:studentId", authGuard, roleGuard("admin"), middleware.checkId("studentId"), middleware.updateStudent, studentsController.updateStudent)
      
      .delete("/students/:studentId", authGuard, roleGuard("admin"), middleware.checkId("studentId"), studentsController.deleteStudent)

  

export default router