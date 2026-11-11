import assistantTeacherService from "../service/assistans.js"

class AssistantTeacherController {

      async getAllAssistant(req, res, next) {
            let resDate = await assistantTeacherService.getAllAssistant(req, res, next)
            if (resDate) {
                  return res.status(resDate.status).json(resDate)
            }
      }

      async createAssistant(req, res, next) {
            let resDate = await assistantTeacherService.createAssistant(req, res, next)
            if (resDate) {
                  return res.status(resDate.status).json(resDate)
            }
      }

      async updateAssistant(req, res, next) {
            let resDate = await assistantTeacherService.updateAssistant(req, res, next)
            if (resDate) {
                  return res.status(resDate.status).json(resDate)
            }
      }

      async deleteAssistant(req, res, next) {
            let resDate = await assistantTeacherService.deleteAssistant(req, res, next)
            if (resDate) {
                  return res.status(resDate.status).json(resDate)
            }
      }

      async addAssistantSection(req, res, next) {
            let resDate = await assistantTeacherService.addAssistantSection(req, res, next)
            if (resDate) {
                  return res.status(resDate.status).json(resDate)
            }
      }

      async deleteAssistantSection(req, res, next) {
            let resDate = await assistantTeacherService.deleteAssistantSection(req, res, next)
            if (resDate) {
                  return res.status(resDate.status).json(resDate)
            }
      }

      async getAssistantSections(req, res, next) {
      let resDate = await assistantTeacherService.getAssistantSections(req, res, next)
      if (resDate) return res.status(resDate.status).json(resDate)
      }
}

const assistantTeacherController = new AssistantTeacherController()
export default assistantTeacherController