import dotenv from "dotenv";
import * as crypto from "crypto";

dotenv.config();

interface IConfig {
	POSTGRESQL: {
		url: string;
		type: "postgres" | "mysql" | "mariadb" | "sqlite";
		host: string;
		port: number;
		user: string;
		password: string;
		dbName: string;
	};
	SQLITE: {
		url: string,
		type: "postgres" | "mysql" | "mariadb" | "sqlite",
		database: string,
	}
	Encryption: {
		algorithm: "aes-256-gcm" | "aes-256-ccm" | "aes-256-ocb" | "aes-256-cbc";
		key: string;
		iv: string;
	};
	Server: {
		port: number;
	};
	JWT: { key: string };
}

export const config: IConfig = {
	POSTGRESQL: {
		url: process.env.DB_URL || "",
		type: "postgres",
		host: process.env.DB_HOST || "localhost",
		port: Number(process.env.DB_PORT) || 5432,
		user: process.env.DB_USER || "abdul",
		password: process.env.DB_PASSWORD || "abdul",
		dbName: process.env.DB_NAME || "abdul",
	},
	SQLITE: {
		url: process.env.DB_URL || "",
		type: "sqlite",
		database: process.env.DB_DATABASE || "database.sqlite", // Specify the SQLite database file path
	},
	Encryption: {
		algorithm: "aes-256-cbc",
		key: "12345678901234567890123456789012",
		iv: "1234567890123456",
	},
	Server: {
		port: Number(process.env.PORT) || 1337,
	},
	JWT: {
		key: process.env.JWT_SECRET || "",
	},
};
