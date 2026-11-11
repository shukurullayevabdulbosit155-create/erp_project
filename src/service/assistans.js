import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException } from "../utils/error.js"

class AssistantTeacherService {

      async getAllAssistant(req, res, next) {

            try {

               const assistants = await pool.query(
                  `select id, fullname, phone, photo, role, status, create_at
                  from staff where role=$1`,
                  ["assistant_teacher"]
               )

            return {
                  status: 200,
                  data: assistants.rows
            }

            } catch (error) {
                  return next(new ErrorException(500, error))
            }

      }

      async createAssistant(req, res, next) {
        try {

            const {fullname, phone, password} = req.body

            const existAsistant = await pool.query(`select id from staff where phone=$1`, [phone])
            if(existAsistant.rows.length){
                  return next(new ErrorException(409,"Assistant  with this phone already exist!"))
            }


             let hashPass = await argon.hash(password)

                  await pool.query(`insert into staff(fullname, phone, password, role) values($1, $2, $3, $4)`,
                        [fullname, phone, hashPass, "assistant_teacher"])

                  return{
                        status:201,
                       message: "Assistant added!"
                  }

        } catch (error) {
                  return next(new ErrorException(500, error))
            }
      }

      async updateAssistant(req, res, next) {
            try {
                  const { assistantId } = req.params
                  const { fullname, phone, password } = req.body || {}

                  const existAssistant = await pool.query(
                        `select * from staff where id=$1 and role=$2`,
                        [assistantId, "assistant_teacher"]
                  )

                  if (!existAssistant.rows.length) {
                        return next(new ErrorException(404, "Assistant not found!"))
                  }

                  if ([fullname, phone, password].every(value => value === undefined)) {
                        return next(new ErrorException(400, "Nothing to update!"))
                  }

                  let hashPass = null

                  if (password) {
                        hashPass = await argon.hash(password)
                  }

                  await pool.query(
                        `update staff set
                        fullname=coalesce($1,fullname),
                        phone=coalesce($2,phone),
                        password=coalesce($3,password)
                        where id=$4 and role=$5`,
                        [fullname, phone, hashPass, assistantId, "assistant_teacher"]
                  )

                  return {
                        status: 200,
                        message: "Assistant updated!"
                  }

            } catch (error) {
                  return next(new ErrorException(500, error))
            }
      }

      async deleteAssistant(req, res, next) {
            try {
                  const { assistantId } = req.params

                  const existAssistant = await pool.query(
                        `select id from staff where id=$1 and role=$2`,
                        [assistantId, "assistant_teacher"]
                  )

                  if (!existAssistant.rows.length) {
                        return next(new ErrorException(404, "Assistant not found!"))
                  }

                  await pool.query(
                        `update staff set status=$1 where id=$2 and role=$3`,
                        ["inactive", assistantId, "assistant_teacher"]
                  )

                  return {
                        status: 200,
                        message: "Assistant deleted!"
                  }

            } catch (error) {
                  return next(new ErrorException(500, error))
            }
      }

      async addAssistantSection(req, res, next) {
            try {
                  const { assistantId, sectionId } = req.body

             const existAssistant = await pool.query(
                  `select id from staff where id=$1 and role=$2`,
                  [assistantId, "assistant_teacher"]
                  )

            if (!existAssistant.rows.length) {
            return next(new ErrorException(404, "Assistant not found!"))
                  }


      const existSection = await pool.query(`select id from sections where id=$1`,[sectionId])

                  if (!existSection.rows.length) {
                  return next(new ErrorException(404, "Section not found!"))
                  }



                  const existAssistantSection = await pool.query(
                  `select id from section_assistants
                  where assistant_id=$1 and section_id=$2`,
                  [assistantId, sectionId]
                  )

            if (existAssistantSection.rows.length) {
            return next(new ErrorException(409, "Assistant already added to this section!"))
            }

             await pool.query(
                  `insert into section_assistants(assistant_id, section_id)
                  values($1, $2)`,
                  [assistantId, sectionId]
                  )

                  return {
                  status: 201,
                  message: "Assistant added to section!"
                  }

            } catch (error) {
                  return next(new ErrorException(500, error))
            }
      }

      async deleteAssistantSection(req, res, next) {
    try {
        const { assistantId, sectionId } = req.body

        await pool.query(
      `delete from section_assistants
      where assistant_id=$1 and section_id=$2`,
      [assistantId, sectionId]
      )

      return {
      status: 200,
      message: "Assistant removed from section!"
      }     
    } catch (error) {
        return next(new ErrorException(500, error))
    }
      }

      async getAssistantSections(req, res, next) {
    try {
        const { assistantId } = req.params

        const result = await pool.query(`
            SELECT s.id,s.name,s.course_id,sa.assistant_id FROM section_assistants sa
            JOIN sections s ON s.id = sa.section_id
            WHERE sa.assistant_id = $1
        `, [assistantId])

        return {
            status: 200,
            data: result.rows
        }
    } catch (error) {
        return next(error)
    }
      }

}

const assistantTeacherService = new AssistantTeacherService()
export default assistantTeacherService