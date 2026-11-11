import Joi from "joi"

export default {

      staffSchema: Joi.object({
            fullName: Joi.string().min(3).max(30).required(),
            phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
            password:Joi.string().min(6).required(),
            role:Joi.string().required()

      }),


      studentSchema:Joi.object({
            fullName: Joi.string().min(3).max(30).required(),
            phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
            password:Joi.string().min(6).required(),
            // course_id:Joi.number().integer().required()

      }),

      purchaseCourseSchema: Joi.object({
            course_id: Joi.number().integer().positive().required()
      }),

      categoieySchema:Joi.object({
            name: Joi.string().min(3).max(30).required(),

      }),

      courseSchema:Joi.object({
            name: Joi.string().min(3).max(30).required(),
            description: Joi.string().max(500),
            level: Joi.string().pattern(/^(beginner|elementary|intermediate|advance)$/).required(),
           price: Joi.string().pattern(/^\d+$/).required(),
            category_id:Joi.number().integer().positive().required(),

      }),

      lessonSchema: Joi.object({
        name: Joi.string().min(3).max(30).required(),
        description: Joi.string().max(500).required(),
        section_id: Joi.number().integer().positive().required()
       }),

      updateLessonSchema: Joi.object({
        name: Joi.string().min(3).max(30),
        description: Joi.string().max(500),
        section_id: Joi.number().integer().positive()
       }),

      teacherSchema: Joi.object({
            fullname: Joi.string().min(3).max(30).required(),
            phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/).required(),
            password: Joi.string().min(6).required(),
      }),

      assistantSchema: Joi.object({
      fullname: Joi.string().min(3).max(30).required(),
      phone: Joi.string().required(),
      password: Joi.string().min(6).required(),
      }),

      updateAssistantSchema: Joi.object({
      fullname: Joi.string().min(3).max(30),
      phone: Joi.string(),
      password: Joi.string().min(6),
      }),

      assistantSectionSchema: Joi.object({
      assistantId: Joi.number().integer().positive().required(),
      sectionId: Joi.number().integer().positive().required(),
      }),

      updateTeacherSchema: Joi.object({
            fullname: Joi.string().min(3).max(30),
            phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/),
            password: Joi.string().min(6),
      }),

      updateCategorySchema: Joi.object({
            name: Joi.string().min(3).max(30).required(),
      }),

      updateCourseSchema: Joi.object({
            name: Joi.string().min(3).max(30),
            description: Joi.string().max(500),
            level: Joi.string().pattern(/^(beginner|elementary|intermediate|advance)$/),
            price: Joi.string().pattern(/^\d+$/),
            category_id: Joi.number().integer().positive(),
      }),

      updateSectionSchema: Joi.object({
            name: Joi.string().min(3).max(30).required(),
      }),

      updateMaterialSchema: Joi.object({
            description: Joi.string().max(500),
      }).unknown(true),

      updateTaskSchema: Joi.object({
            description: Joi.string().max(500),
      }).unknown(true),

      updateExamSchema: Joi.object({
            question: Joi.string(),
            variantA: Joi.string(),
            variantB: Joi.string(),
            variantC: Joi.string(),
            variantD: Joi.string(),
            answer: Joi.string(),
      }),

      updateStudentSchema: Joi.object({
            fullName: Joi.string().min(3).max(30),
            phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/),
            password: Joi.string().min(6),
      }),

      updateStaffSchema: Joi.object({
            fullName: Joi.string().min(3).max(30),
            phone: Joi.string().pattern(/^\+998(9[0123456789]|3[3]|7[1]|8[8])[0-9]{7}$/),
            password: Joi.string().min(6),
            role: Joi.string(),
      }),
} 
