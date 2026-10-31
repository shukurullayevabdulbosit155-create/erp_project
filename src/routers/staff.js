import express from  "express"
const router = express.Router()
import staffController from "../cantroller/staff.js"
import validationMiddlewere from "../midllewere/validation.js"

router
      .get("/staff", staffController.getAllStaff)
      .post("/staff",validationMiddlewere.staffCreate, staffController.createStaff)
      .delete("/staff/:userId", staffController.deleteStaff)

export default router