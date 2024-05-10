import { Router, Request, Response } from "express"
import usersController from "../controller/users.controller"
import { IQuerys } from "../interface/common.interface"
import authController from "../controller/auth.controller"


const authRoute = Router()

authRoute
    .post("/signin", async(req: Request, res: Response) => {
        try {
            const result = await authController.signin(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })

export default authRoute

