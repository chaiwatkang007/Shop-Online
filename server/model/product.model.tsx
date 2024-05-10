import {
    Table,
    Column,
    DataType,
    Model,
    PrimaryKey,
    AutoIncrement,
  } from "sequelize-typescript";
  
  @Table({ timestamps: false, tableName: "product", underscored: true })
  class Product extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER})
    id: number;
  
    @Column({ type: DataType.TEXT })
    pd_name: string;
    
    @Column({ type: DataType.TEXT })
    pd_detail: string;

    @Column({ type: DataType.INTEGER })
    pd_price: number;

    @Column({ type: DataType.TEXT })
    pd_image: string;

    @Column({ type: DataType.TEXT })
    pd_type: string;
  }
  
  export default Product;
  