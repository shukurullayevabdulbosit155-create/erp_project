import { Router } from "express"
const router = Router()
import teacherController from "../cantroller/teacher.js"

router 
      .post("/teachers", teacherController.createTeacher)

export default router
