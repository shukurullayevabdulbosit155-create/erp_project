import materialService from "../service/materials.js"

class MaterialsController {
    constructor() { }

    async getMaterialBySectionId(req, res, next) {

        let resData = await materialService.getMaterialsBySectionId(req, res, next)

        if (resData) {
    return res.status(resData.status).json(resData)
      }
        
    }

    async getAllMaterials(req, res, next) { 
        let resData = await materialService.getAllMaterials(req, res, next)
        return res.status(resData.status).json(resData)
    }

    async createMaterial(req, res, next) {
        let resData = await materialService.createMaterial(req, res, next)
        if(resData) {
            return res.status(resData.status).json(resData)
        }
    
    }

  
      async updateMaterial(req,res,next){

            let resDate = await materialService.updateMaterial(req,res,next)

            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

      async deleteMaterial(req,res,next){

            let resDate = await materialService.deleteMaterial(req,res,next)

            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

   
}

const materialsController = new MaterialsController()

export default materialsController