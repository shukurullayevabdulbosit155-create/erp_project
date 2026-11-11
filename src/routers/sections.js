import express from  "express"
const router = express.Router()
import sectionController from "../cantroller/sections.js"
import  middleware from "../midllewere/validation.js"
import { roleGuard } from "../guards/role.guard.js"
import { authGuard } from "../guards/auth.guard.js"


router
  

      .get("/sections/:courseId", authGuard ,roleGuard("teacher","admin", "student"), sectionController.getAllSections)

      .get("/sections/all", authGuard ,roleGuard("admin"), sectionController. getAllSections)

      .post("/sections", authGuard ,roleGuard("teacher"), sectionController.createSections)

      .put("/sections/:sectionId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("sectionId"), middleware.updateSection, sectionController.updateSection)
      .delete("/sections/:sectionId", authGuard, roleGuard("teacher", "admin"), middleware.checkId("sectionId"), sectionController.deleteSection)

  

export default router