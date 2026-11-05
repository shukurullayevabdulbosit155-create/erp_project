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
            password:Joi.string().min(6).required()

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

} 
