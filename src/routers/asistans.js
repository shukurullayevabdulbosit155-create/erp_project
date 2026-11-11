import { Router } from "express"
const router = Router()

import assistantTeacherController from "../cantroller/asistans.js"
import middleware from "../midllewere/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router

      .get("/assistants", authGuard, roleGuard("admin"),assistantTeacherController.getAllAssistant)

      .get("/assistants/:assistantId/sections", authGuard, roleGuard("admin"), middleware.checkId("assistantId"), assistantTeacherController.getAssistantSections)

      .post("/assistants",authGuard,roleGuard("admin"),middleware.assistantCreate,assistantTeacherController.createAssistant)

      .put("/assistants/:assistantId",authGuard,roleGuard("admin"),middleware.checkId("assistantId"),middleware.updateAssistant,assistantTeacherController.updateAssistant)

      .delete("/assistants/:assistantId", authGuard, roleGuard("admin"), middleware.checkId("assistantId"), assistantTeacherController.deleteAssistant)

      .post("/assistants/sections",authGuard,roleGuard("admin"),middleware.assistantSection,assistantTeacherController.addAssistantSection)

      .delete("/assistants/sections",authGuard,roleGuard("admin"),middleware.assistantSection,assistantTeacherController.deleteAssistant)

      


export default router