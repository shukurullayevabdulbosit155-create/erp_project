import express from  "express"
const router = express.Router()
import categoiesController from "../cantroller/categories.js"
import  middleware from "../midllewere/validation.js"
import { roleGuard } from "../guards/role.guard.js"
import { authGuard } from "../guards/auth.guard.js"


router
  

      .get("/categoies", authGuard ,roleGuard("admin"), categoiesController.getAllCategories)

      .post("/categoies", authGuard ,roleGuard("admin"),middleware.Createcategoies, categoiesController.createCategory)

      .put("/categoies/:categoryId", authGuard, roleGuard("admin"), middleware.checkId("categoryId"), middleware.updateCategory, categoiesController.updateCategory)
      
      .delete("/categoies/:categoryId", authGuard, roleGuard("admin"), middleware.checkId("categoryId"), categoiesController.deleteCategory)
   
  

export default router