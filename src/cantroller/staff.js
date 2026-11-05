import staffService from "../service/staff.js"

class StaffController{
      constructor(){}


      async getAllStaff(req,res,next){
            let resDate = await staffService.getStaff(req,res,next)
            
            return res.status(resDate.status).json(resDate)

      }

     async createStaff(req,res, next){
       let resDate =  await staffService.createStaff(req,res,next)
       return res.status(resDate.status).json(resDate)
      }
      
      async deleteStaff(req,res,next){
            let resDate = await staffService.deleteStaff(req,res,next)
           if(resDate){
             return res.status(resDate.status).json(resDate)
           }
      }

}


const staffController = new StaffController()

export default staffController