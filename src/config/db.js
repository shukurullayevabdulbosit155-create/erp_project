import {Pool} from "pg"
import { configDotenv } from "dotenv"
configDotenv()

const pool = new Pool({
      connectionString: process.env.DATABASE_URL
})

export default pool