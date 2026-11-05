import express from  "express"
const router = express.Router()
import courseController from "../cantroller/courses.js"
import  middleware from "../midllewere/validation.js"
import { roleGuard } from "../guards/role.guard.js"
import { authGuard } from "../guards/auth.guard.js"


router
  

      .get("/courses", authGuard ,roleGuard("admin"), courseController.getAllCourses)

      .post("/courses", authGuard ,roleGuard("teacher"),middleware.CourseCreate, courseController.createCourse)
  

export default router