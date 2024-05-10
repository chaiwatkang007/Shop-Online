import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Length,
} from "sequelize-typescript";

@Table({ timestamps: false, tableName: "users", underscored: true })
class Users extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @Column({ type: DataType.TEXT })
  username: string;
  @Column({ type: DataType.TEXT })
  password: string;
  @Column({ type: DataType.TEXT })
  role: string;
  @Column(DataType.DATE)
  createdDate: Date;
  @Column({ type: DataType.TEXT })
  email: string;
  @Column({ type: DataType.TEXT })
  verify: string;
  @Column({ type: DataType.TEXT })
  createdDay: string;
}

export default Users;
