import teacherRouter from "./teachers.js"
import staffRouter from "./staff.js"
import authRouter from "./auth.js"
import studentRouter from "./students.js"
import categoryRouter from "./categories.js"
import courseRouter from "./courses.js"
import sectionRouter from "./sections.js"
import lessonsRouter from "./lessons.js"
import materialRouter from "./materials.js"
import taskRouter from "./tasks.js"
import examRouter from "./exams.js"
import asistanRouter from "./asistans.js"

import { Router } from "express"

const main = Router()

main 

    .use("/api/v1", staffRouter)
    .use("/api/v1", authRouter)
    .use("/api/v1", teacherRouter)
    .use("/api/v1", studentRouter)
    .use("/api/v1", categoryRouter)
    .use("/api/v1", courseRouter)
    .use("/api/v1", sectionRouter)
    .use("/api/v1", lessonsRouter)
    .use("/api/v1", materialRouter)
    .use("/api/v1", taskRouter)
    .use("/api/v1", examRouter)
    .use("/api/v1", asistanRouter)


export default main