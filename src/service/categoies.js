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

    
      async updateCategory(req,res,next){
            try {
                  const {categoryId} = req.params
                  const {name} = req.body || {}

                  const existCategory = await pool.query(`select * from categories where id=$1`, [categoryId])
                  if(!existCategory.rows.length){
                        return next(new ErrorException(404, "Category not found!"))
                  }

                  const existName = await pool.query(`select * from categories where name=$1 and id!=$2`, [name, categoryId])
                  if(existName.rows.length){
                        return next(new ErrorException(409, "Category already exist!"))
                  }

                  await pool.query(`update categories set name=$1 where id=$2`, [name, categoryId])

                  return{
                        status:200,
                        message: "Category updated!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }

      async deleteCategory(req,res,next){
            try {
                  const {categoryId} = req.params

                  const existCategory = await pool.query(`select * from categories where id=$1`, [categoryId])
                  if(!existCategory.rows.length){
                        return next(new ErrorException(404, "Category not found!"))
                  }

                  const courses = await pool.query(`select id from courses where category_id=$1 limit 1`, [categoryId])
                  if(courses.rows.length){
                        return next(new ErrorException(409, "Category has courses! Delete or move courses first"))
                  }

                  await pool.query(`delete from categories where id=$1`, [categoryId])

                  return{
                        status:200,
                        message: "Category deleted!"
                  }
            } catch (error) {
                  return next(new ErrorException(500,error))
            }
      }
      
}

const categoryService = new CategoryService()
export default categoryService