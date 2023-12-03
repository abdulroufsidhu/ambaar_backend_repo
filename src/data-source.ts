import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/user"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "abdul",
    password: "abdul",
    database: "abdul",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
