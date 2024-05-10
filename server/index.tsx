import express, { Application } from "express"
import bodyParser from "body-parser"
import { NODE_ENV } from "./common/setting"
import { sequelize } from "./common/db"
import baseRouter from "./route"
import cors from "cors"

const next = require('next')

const dev = NODE_ENV !== "production"
const app = next({ dev, dir: "./client" });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(async() => {
    const server: Application = express();
    server.use(express.json({ limit: "100mb" }))
    server.use(express.urlencoded({ extended: true }))
    server.use(bodyParser.json())
    server.use(cors())
    server.use(bodyParser.urlencoded({extended: true}))
    server.use("/", express.static("client"))

    server.use(baseRouter)


    server.get("*", (req: express.Request, res: express.Response) => {
      return handle(req, res);
    });

    sequelize.sync({ logging: false, force: false })
    
    server.listen(3000, () => {
        console.log(`🚀 Server ready at http://localhost:${3000}`)
        console.log(`🚀 Database ready at PORT 5432`)
    });
  })
  .catch((ex: any) => {
    console.error(ex.stack);
    process.exit(1);
  })
