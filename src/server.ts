import express from "express";
import mongoose, { Error } from "mongoose";
import http from "http";
import { config } from "./config/config";
import { Logger } from "./libraries/logger";
import cors from "cors";
import {
	permissionRoutes,
	productRoutes,
	routes,
	inventoryRoutes,
	operationRoutes,
} from "./routes";
import userRoutes from "./routes/user.route";
import branchRoutes from "./routes/branch.route";
import businessRoutes from "./routes/business.route";
import personRoutes from "./routes/person.route";
import employeeRoutes from "./routes/employee.route";
import Routes from "./routes/routes";
import { AppDataSource } from "./data_source";
import { PermissionController } from "./controllers";

const server = express();

server.use(cors());

const createPermissions = async () => {
	const permController = new PermissionController();
	const permissions = []
	try {
		for (const base in Routes) {
			if (Routes.hasOwnProperty(base)) {
				for (const url in Routes[base]) {
					if (Routes[base].base != Routes[base][url]) {
						// Create a new Permission document
						const permissionName = `${Routes[base].base}${Routes[base][url]}`;
						// Save the document to the database
						permissions.push({ name: permissionName });
					}
				}
			}
		}
		await permController.create(permissions)
	} catch (error) {}
};

const connectToDB = () => {
	AppDataSource.initialize()
		.then(() => {
			Logger.d("server", "connected to databse");
			createPermissions();
			startServer();
		})
		.catch((error) => {
			Logger.w("server", error);
		});

	// since we are moving toward sqlite so no longer connecting to mongo db
	// mongoose
	// 	.connect(config.POSTGRESQL.url)
	// 	.then(() => {
	// 		Logger.d("server", "connedted to database");
	// 		createPermissions();
	// 		startServer();
	// 	})
	// 	.catch((error) => {
	// 		Logger.d("server", `${error}`);
	// 		connectToDB();
	// 	});
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
	server.use(routes.person.base, personRoutes);
	server.use(routes.user.base, userRoutes);
	server.use(routes.businesses.base, businessRoutes);
	server.use(routes.branches.base, branchRoutes);
	server.use(routes.employees.base, employeeRoutes);
	server.use(routes.permissions.base, permissionRoutes);
	server.use(routes.products.base, productRoutes);
	server.use(routes.inventory.base, inventoryRoutes);
	server.use(routes.operation.base, operationRoutes);

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
