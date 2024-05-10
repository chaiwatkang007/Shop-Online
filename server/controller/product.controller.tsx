import { IQuerys } from "../interface/common.interface";
import {Addproduct , Updateproduct, removeproduct } from "../interface/product.interface";
import Product from "../model/product.model";
const genQuery = (args: IQuerys) => {
  let body: any = {};
  if (args?.query) {
    body = {
      ...body,
    };
  }
  return body;
};

const ProductController = {
  product: async (args: IQuerys) => {
    return Product
      .findAndCountAll({
        where: genQuery(args),
        limit: args?.limit,
        offset: args?.skip,
      })
      .then(({ rows, count }) => {
        return { count, rows: rows };
      });
  },
  addproduct: async (args: Product) => {
    try {
      let newUser = await Product.create({
        pd_name: args.pd_name,
        pd_detail: args.pd_detail,
        pd_price: args.pd_price,
        pd_image: args.pd_image,
        pd_type: args.pd_type,
      });
      return newUser;
    } catch (error) {
      throw new Error(`Failed to add Product: ${error}`);
    }
  },
  update: async (args: Updateproduct) => {
    let user = await Product.findOne({ where: { id: args.id } });
    if (!user) throw Error("ไม่พบสินค้านี้ในระบบ");

    let newUser = await user.update({
      pd_name: args.pd_name,
      pd_detail: args.pd_detail,
      pd_price: args.pd_price,
      pd_image: args.pd_image,
      pd_type: args.pd_type,
    });

    return newUser;
  },
  remove: async (args: removeproduct) => {
    let user = await Product.findOne({ where: { id: args?.id } });
    if (!user) throw Error("ไม่พบสินค้านี้ในระบบ");
    await user.destroy();
    return "ลบสินค้าแล้ว";
  },
};

export default ProductController;
