import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Length,
  AutoIncrement,
} from "sequelize-typescript";

@Table({ timestamps: false, tableName: "order", underscored: true })
class Order extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  od_id: number;

  @Column({ type: DataType.TEXT })
  od_name: string;

  @Column({ type: DataType.INTEGER })
  od_quan: number;

  @Column(DataType.DOUBLE)
  od_price: number ;

  @Column({ type: DataType.TEXT })
  od_status: string;

  @Column(DataType.TEXT)
  od_username: string;

  @Column(DataType.INTEGER)
  odpd_id: number

  @Column(DataType.TEXT)
  od_time
}

export default Order;
