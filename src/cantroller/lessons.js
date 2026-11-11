import lessonService from "../service/lessons.js"

class LessonController {
    constructor() { }

    async getLessonsBySectionId(req, res, next) {
        let resData = await lessonService.getLessonsBySectionId(req, res, next)
        if(resData) {
            return res.status(resData.status).json(resData)
        }
    }

    async getAllLessons(req, res, next) {
        let resData = await lessonService.getAllLessons(req, res, next)
        return res.status(resData.status).json(resData)
    }

    async createLesson(req, res, next) {
        let resData = await lessonService.createLesson(req, res, next)
        if(resData) {
            return res.status(resData.status).json(resData)
        }
    
    }

    
      async updateLesson(req,res,next){

            let resDate = await lessonService.updateLesson(req,res,next)

            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

      async deleteLesson(req,res,next){

            let resDate = await lessonService.deleteLesson(req,res,next)

            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

}

const lessonController = new LessonController()

export default lessonController