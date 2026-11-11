import express from  "express"

const router = express.Router()
import courseController from "../cantroller/courses.js"
import  middleware from "../midllewere/validation.js"
import { roleGuard } from "../guards/role.guard.js"
import { authGuard } from "../guards/auth.guard.js"


router
  

      .get("/courses/all", courseController.getAllCourses)

     
      .get("/courses/category/:categoryId", middleware.checkId("categoryId"), courseController.getCoursesByCategory)
      
      .get("/courses/my", authGuard ,roleGuard("teacher", "student"), courseController.getAllCourses)

      .post("/courses", authGuard ,roleGuard("teacher"), middleware.CourseCreate, courseController.createCourse)

      .put("/course/approved/:courseId", authGuard ,roleGuard("admin"),  courseController.courseApproved)

      
      .put("/courses/:courseId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("courseId"), middleware.updateCourse, courseController.updateCourse)
      
      .delete("/courses/:courseId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("courseId"), courseController.deleteCourse)  

export default router