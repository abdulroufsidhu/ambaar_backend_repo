import dotenv from "dotenv";

dotenv.config();

export const config = {
  DB: {
    url: process.env.DB_URL || "",
  },
  Server: {
    port: Number(process.env.PORT) || 1337,
  },
  JWT: {
    key: process.env.JWT_SECRET || "",
  }
};
