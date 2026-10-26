import staffService from "../service/staff.js"
class StaffController{
      constructor(){}

      createAdmin(req,res){
         return staffService.createStaff(req)
      }
      
}