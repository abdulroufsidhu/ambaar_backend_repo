import express from "express";
import mongoose from "mongoose";
import http from "http";
import { config } from "./config/config";
import { Logger } from "./libraries/logger";
import cors from "cors";
import {
  businessRoutes,
  personRoutes,
  userRoutes,
  branchRoutes,
  employeeRoutes,
  permissionRoutes,
  productRoutes,
  routes,
  inventoryRoutes,
} from "./routes";

const server = express();

server.use(cors());

const connectToDB = () => {
  mongoose
    .connect(config.DB.url)
    .then(() => {
      Logger.d("server", "connedted to database");
      startServer();
    })
    .catch((error) => {
      Logger.d("server", `${error}`);
      connectToDB();
    });
};

connectToDB();

function startServer() {
  // Server Requests Logger Middleware
  server.use((req, res, next) => {
    Logger.i(
      "server",
      `incomming -> method: [${req.method}] - url: [${req.url}] - ip: [${req.socket.remoteAddress}]]`
    );

    res.on("finish", () => {
      Logger.s(
        "server",
        `received -> method: [${req.method}] - url: [${req.originalUrl}] - ip: [${req.socket.remoteAddress}] - status: [${req.statusCode}]`
      );
    });
    next();
  });

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Rules for api
  server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header(
    //   "Access-Control-Allow-Origin",
    //   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    // );
    if (req.method.toLocaleLowerCase() == "options") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  });


  // TODO implement jwt (json web token) and then authenticate actions with permission
  // Routes
  server.use(routes.person, personRoutes);
  server.use(routes.users, userRoutes);
  server.use(routes.businesses, businessRoutes);
  server.use(routes.branches, branchRoutes);
  server.use(routes.employees, employeeRoutes);
  server.use(routes.permissions, permissionRoutes);
  server.use(routes.products, productRoutes);
  server.use(routes.inventory, inventoryRoutes);

  // Health Check
  server.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));

  // Error Handeling, i.e no routes matched from above and shall be an error
  server.use((req, res, next) => {
    const error = new Error(`url: ${req.url} not found`);
    Logger.e("server", error);
    return res.status(404).json({ message: error.message });
  });

  http.createServer(server).listen(config.Server.port, () => {
    Logger.i("server", `connected to http://localhost:${config.Server.port}`);
  });
}
