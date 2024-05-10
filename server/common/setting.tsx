import fs from "fs"
import dotenv from "dotenv"


const env = process.env.NODE_ENV
const envFile: string = `.env.${env}`

if (fs.existsSync(envFile)) {
  console.log(`Using ${envFile} file to supply config environment variables`)
  dotenv.config({ path: envFile })
}

const NODE_ENV: string = process.env.NODE_ENV || ""

export { NODE_ENV }