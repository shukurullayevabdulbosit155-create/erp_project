import express from  "express"
const router = express.Router()
import authController from "../cantroller/auth.js"


router
   
.post("/auth/login", authController.login)
  

export default router