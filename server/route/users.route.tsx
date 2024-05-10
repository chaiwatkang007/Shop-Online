import { Router, Request, Response } from "express"
import usersController from "../controller/users.controller"
import { IQuerys } from "../interface/common.interface"


const userRoute = Router()

userRoute
    .get("/", async(req: Request, res: Response) => {
        try {
            const result = await usersController.users(req?.params as unknown as IQuerys)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/create", async(req: Request, res: Response) => {
        try {
            const result = await usersController.create(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/update", async(req: Request, res: Response) => {
        try {
            const result = await usersController.update(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/delete", async(req: Request, res: Response) => {
        try {
            const result = await usersController.delete(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })

export default userRoute