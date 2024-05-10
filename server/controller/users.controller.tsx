import { v4 } from "uuid";
import {
  CreateUser,
  DeleteUser,
  UpdateUser,
} from "../interface/users.interface";
import Users from "../model/users.model";
import { IId, IQuerys } from "../interface/common.interface";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import moment from "moment";

const genQuery = (args: IQuerys) => {
  let body: any = {};
  if (args?.query) {
    body = {
      ...body,
      [Op.or]: [{ username: { [Op.like]: `%${args?.query}%` } }],
    };
  }
  return body;
};

const usersController = {
  users: async (args: IQuerys) => {
    return Users.findAndCountAll({
      where: genQuery(args),
      limit: args?.limit,
      offset: args?.skip,
    }).then(({ rows, count }) => {
      return { count, rows: rows };
    });
  },
  create: async (args: CreateUser) => {
    let user = await Users.findOne({ where: { username: args?.username } });
    if (user) throw Error("ผู้ใช้งานนี้มีอยู่ในระบบอยู่แล้ว");

    const currentDate = new Date();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(args.password, saltRounds);

    let newUser = await Users.create({
      id: v4(),
      ...args,
      password: hashedPassword,
      createdDay: currentDate.toISOString().slice(0,10) + " " +moment(currentDate).utcOffset(7).format("HH:mm")
    });
    return newUser;
  },
  update: async (args: UpdateUser) => {
    let user = await Users.findOne({ where: { id: args.id } });
    if (!user) throw Error("ไม่พบผู้ใช้งานนี้มีอยู่ในระบบ");

    let newUser = await user.update({
      username: args.username,
      role: args.role,
      email: args.email
    })
    
    return newUser
  },
  delete: async (args: DeleteUser) => {
    let user = await Users.findOne({where: {username: args?.username }});
    if (!user) throw Error("ไม่พบผู้ใช้งานนี้มีอยู่ในระบบ");
    await user.destroy();
    return "ลบผู้ใช้งานสำเร็จ";
  },
};

export default usersController;
