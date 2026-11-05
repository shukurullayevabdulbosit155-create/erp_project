import authService from "../service/auth.js"
class AuthController{
      async login(req,res,next){

            let resDate = await authService.login(req,res,next)
            
            return res.status(resDate.status).json(resDate)
      }
}

const authController = new AuthController()

export default authController