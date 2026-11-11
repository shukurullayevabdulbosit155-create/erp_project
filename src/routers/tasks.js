import express from "express"
const router = express.Router()

import taskController from "../cantroller/tasks.js"
import middleware from "../midllewere/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    // .get("/tasks/all", authGuard, roleGuard("admin"),taskController.getAllTasks)
    
    .get("/tasks/:lessonId", authGuard, roleGuard("admin", "teacher"),  taskController.getTaskBySectionId)
    .post("/tasks", authGuard, roleGuard("teacher"),taskController.createTask)
      .put("/tasks/:taskId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("taskId"), middleware.updateTask, taskController.updateTask)
      .delete("/tasks/:taskId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("taskId"), taskController.deleteTask)
   
export default router   