import { ErrorException } from "../utils/error.js"
import schema from "../utils/validation.js"

export default{

      staffCreate:(req,res,next) =>{
            
            let {error} = schema.staffSchema.validate(req.body)

            if(error){

                  return next(new ErrorException(400,error.message))

            }

            return next()
      },
      
      createStudent:(req,res,next) =>{
            
            let {error} = schema.studentSchema.validate(req.body)

            if(error){

                  return next(new ErrorException(400,error.message))

            }

            return next()
      },

      assistantCreate: (req, res, next) => {
      let { error } = schema.assistantSchema.validate(req.body)
      if (error) {
            return next(new ErrorException(400, error.message))
      }
      return next()
      },

      updateAssistant: (req, res, next) => {
      let { error } = schema.updateAssistantSchema.validate(req.body || {})
      if (error) {
            return next(new ErrorException(400, error.message))
      }
      return next()
      },

      assistantSection: (req, res, next) => {
      let { error } = schema.assistantSectionSchema.validate(req.body)
      if (error) {
            return next(new ErrorException(400, error.message))
      }
      return next()
      },

      purchaseCourse: (req, res, next) => {
            let { error } = schema.purchaseCourseSchema.validate(req.body)

            if (error) {
                  return next(new ErrorException(400, error.message))
            }

            return next()
      },

      Createcategoies:(req,res,next) =>{
            
            let {error} = schema.categoieySchema.validate(req.body)

            if(error){

                  return next(new ErrorException(400,error.message))

            }

            return next()
      },

      CourseCreate:(req,res,next) =>{
            
            let {error} = schema.courseSchema.validate(req.body)

            if(error){

                  return next(new ErrorException(400,error.message))

            }

            return next()
      },

      lessonSchema: (req, res, next) => {
              console.log("LESSON BODY:", req.body)
        let { error } = schema.lessonSchema.validate(req.body)
        if (error) {
            return next(new ErrorException(400, error.message))
        }
        return next()
      },

      teacherCreate: (req, res, next) => {
            let { error } = schema.teacherSchema.validate(req.body)
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },

      updateTeacher: (req, res, next) => {
            let { error } = schema.updateTeacherSchema.validate(req.body || {})
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },

      checkId: (paramName) => (req, res, next) => {
            if (!/^\d+$/.test(req.params[paramName])) {
                  return next(new ErrorException(400, `${paramName} must be a number`))
            }
            return next()
      },

      updateCategory: (req, res, next) => {
            let { error } = schema.updateCategorySchema.validate(req.body || {})
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },

      updateCourse: (req, res, next) => {
            let { error } = schema.updateCourseSchema.validate(req.body || {})
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },

      updateSection: (req, res, next) => {
            let { error } = schema.updateSectionSchema.validate(req.body || {})
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },

      updateLesson: (req, res, next) => {
            let { error } = schema.updateLessonSchema.validate(req.body || {})
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },

      updateMaterial: (req, res, next) => {
            let { error } = schema.updateMaterialSchema.validate(req.body || {})
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },

      updateTask: (req, res, next) => {
            let { error } = schema.updateTaskSchema.validate(req.body || {})
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },

      updateExam: (req, res, next) => {
            let { error } = schema.updateExamSchema.validate(req.body || {})
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },

      updateStudent: (req, res, next) => {
            let { error } = schema.updateStudentSchema.validate(req.body || {})
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },

      updateStaff: (req, res, next) => {
            let { error } = schema.updateStaffSchema.validate(req.body || {})
            if (error) {
                  return next(new ErrorException(400, error.message))
            }
            return next()
      },
}