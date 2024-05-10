import { Router, Request, Response } from "express";
import { IQuerys } from "../interface/common.interface";
import ProductController from "../controller/product.controller";

const ProductRoute = Router();

ProductRoute
  .get("/", async (req: Request, res: Response) => {
    try {
      const result = await ProductController.product(req?.params as unknown as IQuerys);
      res.status(200).json({ result });
    } catch (err: any) {
      res.status(400).json({ message: err?.message });
    }
  })
  .post("/addproduct", async (req: Request, res: Response) => {
    try {
        const result = await ProductController.addproduct(req?.body);
        res.status(200).json({ result });
    } catch (err: any) {
        res.status(400).json({ message: err?.message });
    }
  })
  .post("/update", async (req: Request, res: Response) => {
    try {
        const result = await ProductController.update(req?.body);
        res.status(200).json({ result });
    } catch (err: any) {
        res.status(400).json({ message: err?.message });
    }
  })
  .post("/remove", async (req: Request, res: Response) => {
    try {
        const result = await ProductController.remove(req?.body);
        res.status(200).json({ result });
    } catch (err: any) {
        res.status(400).json({ message: err?.message });
    }
  })


export default ProductRoute;
