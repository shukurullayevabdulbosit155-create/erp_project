import express from "express"
import main from "./routers/index.js"
import "dotenv/config"
import fs from "fs"
import path from "path"

const app = express()
app.use(express.json())
app.use(main)

app.use((error, req,res, next) =>{

      if(error.status < 500) {
          return res.status(error.status).json({
            status:error.status,
            message:error.message  
          })
      }else{
        fs.appendFileSync(path.join(process.cwd(),"src", "log", "logger.text"),
        `[${new Date().toLocaleString()}]-${req.method}-${req.url}-${error.name}-${error.message}/n`
      )
          return res.status(error.status).json({
            status:error.status,
            message:"Internal Server Error"
          })
      }
})

app.listen(process.env.PORT, (err) => {
     if (err) {
       console.error("Server ishga tushmadi:", err.message)
       process.exit(1)
     }

     console.log(`Server is running on port ${process.env.PORT}`)
})