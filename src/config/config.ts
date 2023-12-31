import dotenv from "dotenv";

dotenv.config();

interface IConfig {
  DB: {
    url: string,
    type: "postgres" | "mysql" | "mariadb" | "sqlite",
    host: string,
    port: number,
    user: string,
    password: string,
    dbName: string,
  }
  Server: {
    port: number,
  }
  JWT: {key: string}
} 

export const config: IConfig = {
	DB: {
		url: process.env.DB_URL || "",
		type: "postgres" ,
		host: process.env.DB_HOST || "localhost",
		port: Number(process.env.DB_PORT) || 5432,
		user: process.env.DB_USER || "abdul",
		password: process.env.DB_PASSWORD || "abdul",
		dbName: process.env.DB_NAME || "abdul",
	},
	Server: {
		port: Number(process.env.PORT) || 1337,
	},
	JWT: {
		key: process.env.JWT_SECRET || "",
	},
};
