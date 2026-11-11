import examsService from "../service/exams.js"

class ExamsController {
    constructor() { }

   async getExamBySectionId(req, res, next) {

      let resData = await examsService.getExamsBySectionId(req, res, next)

        if (resData) {
         return res.status(resData.status).json(resData)
      }
        
    }

    async createExam(req, res, next) {
    let resData = await examsService.createExam(req, res, next)

    if (resData) {
        return res.status(resData.status).json(resData)
    }
}

   
      async updateExam(req,res,next){

            let resDate = await examsService.updateExam(req,res,next)

            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

      async deleteExam(req,res,next){

            let resDate = await examsService.deleteExam(req,res,next)

            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

}

const examsController = new ExamsController()

export default examsController