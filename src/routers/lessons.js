import express from "express"
const router = express.Router()

import lessonController from "../cantroller/lessons.js"
import middleware from "../midllewere/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/lessons/:sectionId", authGuard, roleGuard("student"),  lessonController.getLessonsBySectionId)
    .get("/lessons", authGuard, roleGuard("teacher", "admin"),lessonController.getAllLessons)
    .post("/lessons", authGuard, roleGuard("teacher"), middleware.lessonSchema, lessonController.createLesson)

   
      .put("/lessons/:lessonId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("lessonId"), middleware.updateLesson, lessonController.updateLesson)
      .delete("/lessons/:lessonId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("lessonId"), lessonController.deleteLesson)
     
export default router