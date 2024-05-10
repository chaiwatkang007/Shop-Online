import { Router, Request, Response } from "express"
import { IQuerys } from "../interface/common.interface"
import OrderController from "../controller/order.controller"


const orderRoute = Router()

orderRoute
    .get("/", async(req: Request, res: Response) => {
        try {
            const result = await OrderController.order(req?.params as unknown as IQuerys)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/create", async(req: Request, res: Response) => {
        try {
            const result = await OrderController.create(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/pending", async(req: Request, res: Response) => {
        try {
            const result = await OrderController.pending(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/cancel", async(req: Request, res: Response) => {
        try {
            const result = await OrderController.cancel(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    

    

export default orderRoute