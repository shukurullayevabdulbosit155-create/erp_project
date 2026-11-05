import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class CategoryService{

      async getAllCategories(){

            let categories = await pool.query("select * from categories")

            return{
                  status:200,
                  data:categories.rows
            }
      }

      async createCategory(req,res,next){
            try {

                  const {name} = req.body

            

                  await pool.query(`insert into categories(name) 

                  values($1)`,

                  [name])


                  return{
                        status:201,
                        message: "Categories added!"
                  }

            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }
}

const categoryService = new CategoryService()
export default categoryService