import express from  "express"
const router = express.Router()
import sectionController from "../cantroller/sections.js"
import  middleware from "../midllewere/validation.js"
import { roleGuard } from "../guards/role.guard.js"
import { authGuard } from "../guards/auth.guard.js"


router
  

      .get("/sections", authGuard ,roleGuard("teacher"), sectionController.getAllSections)

      .post("/sections", authGuard ,roleGuard("teacher"), sectionController.createSections)
  

export default router