import express from  "express"
const router = express.Router()
import categoiesController from "../cantroller/categories.js"
import  middleware from "../midllewere/validation.js"
import { roleGuard } from "../guards/role.guard.js"
import { authGuard } from "../guards/auth.guard.js"


router
  

      .get("/categoies", authGuard ,roleGuard("admin"), categoiesController.getAllCategories)

      .post("/categoies", authGuard ,roleGuard("admin"),middleware.Createcategoies, categoiesController.createCategory)
  

export default router