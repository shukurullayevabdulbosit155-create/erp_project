import express from  "express"
const router = express.Router()
import studentsController from "../cantroller/students.js"
import  middleware from "../midllewere/validation.js"
import { roleGuard } from "../guards/role.guard.js"
import { authGuard } from "../guards/auth.guard.js"


router
  

      .get("/students", authGuard ,roleGuard("admin"), studentsController.getAllStudents)

      .post("/students",middleware.createStudent, studentsController.createStudent)
  

export default router