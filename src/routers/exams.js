import express from "express"
const router = express.Router()

import examController from "../cantroller/exams.js"
import middleware from "../midllewere/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/exams/:lessonId", authGuard, roleGuard("admin", "teacher", "student"),  examController.getExamBySectionId)

    .post("/exams", authGuard, roleGuard("teacher"),examController.createExam)

      .put("/exams/:examId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("examId"), middleware.updateExam, examController.updateExam)
      .delete("/exams/:examId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("examId"), examController.deleteExam)

export default router   