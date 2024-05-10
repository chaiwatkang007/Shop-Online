import { Router } from "express"
import userRoute from "./users.route"
import authRoute from "./auth.route"
import OrderRoute from "./order.route"
import Product from "./product.route"


const baseRouter: Router = Router()

baseRouter.use("/api/user", userRoute)
baseRouter.use("/api/auth", authRoute)
baseRouter.use("/api/order", OrderRoute)
baseRouter.use("/api/product", Product )


export default baseRouter