import express from "express"
const router = express.Router()

import materialController from "../cantroller/materails.js"
import middleware from "../midllewere/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/materials/all", authGuard, roleGuard("admin"),materialController.getAllMaterials)
    .get("/materials/:lessonId", authGuard, roleGuard("admin", "teacher"),  materialController.getMaterialBySectionId)
    .post("/materials", authGuard, roleGuard("teacher"),materialController.createMaterial)

      .put("/materials/:materialId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("materialId"), middleware.updateMaterial, materialController.updateMaterial)
      .delete("/materials/:materialId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("materialId"), materialController.deleteMaterial)
  
export default router   