import categorySections from "../service/sections.js"

class SectionController {
  
      async getAllSections(req,res,next){

            let resDate = await categorySections.getAllSections()
            return res.status(resDate.status).json(resDate)

      }

      async createSections(req,res,next){

            let resDate = await categorySections.createSection(req,res,next)
           
            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }
}

const sectionController = new SectionController()
export default sectionController