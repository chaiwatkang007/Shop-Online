import { Sequelize } from "sequelize-typescript"
import { Model } from "../model"

const sequelize = new Sequelize("postgres://myadmin:!qazxsw23edc@seniorproj-postsql-server1.postgres.database.azure.com:5432/test", {
    dialect: "postgres",
    protocol: "postgres",
    define: {
      underscored: true,
      paranoid: true,
      freezeTableName: true,
    },
    models: Model,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    },
    pool: {
      max: 100,
      min: 30,
      acquire: 60000,
      idle: 30000,
    },
});

sequelize
.authenticate()
.then(() => {
    console.log("Connection database has been established successfully.")
})
.catch((error) =>
    console.error("Unable to connect database to the database:", error)
)

export { sequelize }