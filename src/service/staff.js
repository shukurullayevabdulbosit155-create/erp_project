import pool from "../config/db.js"
class StaffService{

      constructor(){}

      async createStaff(req){
            const {fullName,phone,password,role} = req.body

            await pool.query(`insert into staff(fullname,phone,password,role) values($1,$2,$3,$4)`, [fullName,phone,password,role])
      }
}

let staffService = new StaffService()

export default staffService