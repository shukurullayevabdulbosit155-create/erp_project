import tasksService from "../service/tasks.js"

class TasksController {
    constructor() { }

    async getTaskBySectionId(req, res, next) {

       let resData = await tasksService.getTasksBySectionId(req, res, next)

        if (resData) {
    return res.status(resData.status).json(resData)
      }
        
    }

    async createTask(req, res, next) {
    let resData = await tasksService.createTask(req, res, next)

    if (resData) {
        return res.status(resData.status).json(resData)
    }
     }

      async updateTask(req,res,next){

            let resDate = await tasksService.updateTask(req,res,next)

            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

      async deleteTask(req,res,next){

            let resDate = await tasksService.deleteTask(req,res,next)

            if(resDate){
                  return res.status(resDate.status).json(resDate)
            }

      }

     
}

const tasksController = new TasksController()

export default tasksController