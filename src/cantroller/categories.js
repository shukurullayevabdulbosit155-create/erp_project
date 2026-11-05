import categoryService from "../service/categoies.js"

class CategoryController {
  
      async getAllCategories(req,res,next){

            let resDate = await categoryService.getAllCategories()
            return res.status(resDate.status).json(resDate)

      }

      async createCategory(req,res,next){

            let resDate = await categoryService.createCategory(req,res,next)
           
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }
}

const categoryController = new CategoryController()
export default categoryController