import express from  "express"
const router = express.Router()
import { authGuard } from "../guards/auth.guard.js"
import staffController from "../cantroller/staff.js"
import validationMiddlewere from "../midllewere/validation.js"
import { roleGuard } from "../guards/role.guard.js"

router
      .get("/staff", authGuard,roleGuard("admin"), staffController.getAllStaff)

      .post("/staff",validationMiddlewere.staffCreate, staffController.createStaff)
      
      .delete("/staff/:userId", staffController.deleteStaff)

      
      .put("/staff/:userId", authGuard, roleGuard("admin"), validationMiddlewere.checkId("userId"), validationMiddlewere.updateStaff, staffController.updateStaff)
   

export default router