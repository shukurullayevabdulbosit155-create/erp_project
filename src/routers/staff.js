import express from  "express"
const router = express.Router()

router
      .post("/admin", staffController.createAdmin)

export default router