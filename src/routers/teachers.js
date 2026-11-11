import { Router } from "express"
const router = Router()
import teacherController from "../cantroller/teacher.js"
import middleware from "../midllewere/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router

      .get("/teachers", authGuard, roleGuard("admin"), teacherController.getAllTeachers)
      .post("/teachers", authGuard, roleGuard("admin"), middleware.teacherCreate, teacherController.createTeacher)
      .put("/teachers/:teacherId", authGuard, roleGuard("admin"), middleware.checkId("teacherId"), middleware.updateTeacher, teacherController.updateTeacher)
      .delete("/teachers/:teacherId", authGuard, roleGuard("admin"), middleware.checkId("teacherId"), teacherController.deleteTeacher)

export default router
