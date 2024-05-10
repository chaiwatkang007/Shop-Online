import { IQuerys } from "../interface/common.interface";
import Order from "../model/order.model";
import { Cancel, CreateOrder, Pending, UpdateOrder } from "../interface/order.interface";
import moment from "moment";

const genQuery = (args: IQuerys) => {
  let body: any = {};
  if (args?.query) {
    body = {
      ...body,
    };
  }
  return body;
};

const OrderController = {
  order: async (args: IQuerys) => {
    return Order.findAndCountAll({
      where: genQuery(args),
      limit: args?.limit,
      offset: args?.skip,
    }).then(({ rows, count }) => {
      return { count, rows: rows };
    });
  },
  create: async (args: CreateOrder) => {
    const currentDate = new Date();

    let newData = await Order.create({
      od_username:args.od_username,
      od_name: args.od_name,
      od_price: args.od_quan * args.od_price,
      od_quan: args.od_quan,
      od_status: "รอการจัดส่ง",
      odpd_id: args.odpd_id,
      od_time: currentDate.toISOString().slice(0,10) + " " +moment(currentDate).utcOffset(7).format("HH:mm")
    });
    return newData;
  },
  pending: async (args: Pending) => {
  
    let pending = await Order.findOne({ where: { od_id: args?.od_id } });
    
    if (!pending) {
      throw Error("ไม่พบคำสั่งซื้อนี้ในระบบ");
    }
  
    await pending.update({ od_status: "สินค้าถูกจัดส่งแล้ว" });
  
    return "จัดส่งสินค้าเรียบร้อยแล้ว";
  },
  cancel: async (args: Cancel) => {
    // ค้นหาคำสั่งซื้อด้วย od_id
    let order = await Order.findOne({ where: { od_id: args?.od_id } });
    
    if (!order) {
      throw Error("ไม่พบคำสั่งซื้อนี้ในระบบ");
    }
  
    await order.update({ od_status: "ยกเลิกแล้ว" });
  
    return "ยกเลิกแล้ว";
  },
};

export default OrderController;
