import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ControllerFactory } from "./controller.factory";
import { ObjectLiteral } from "typeorm";
import {
	errorResponse,
	successResponse,
} from "../../libraries/unified_response";
import { Employee } from "../../models/pg";
import { UserController } from "./user.controller";
import { BranchController } from "./branch.controller";
import { EmployeeCRUD } from "./crud";
import { PermissionController } from "./permission.controller";
export class EmployeeController extends ControllerFactory<Employee> {
	create = async (value: Employee): Promise<ObjectLiteral> => {
		if (!!!value.user) throw "no user info while creating employee";
		if (!!!value.branch) throw "no branch info while creating employee";
		if (!!!value.permissions)
			throw "no permissions supplied while adding employee";
		if (!!!value.role) throw "no role supplied while adding employee";
		const user = await new UserController().create(value.user);
		const branch = await new BranchController().create(value.branch);
		const permissions = await new PermissionController().createAll(
			value.permissions
		);

		const e = (
			await new EmployeeCRUD().create({ ...value, user, branch, permissions })
		)?.at(0);
		if (!!!e) throw "unable to create employee with data " + value;
		return e;
	};
	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const data = await this.create(req.body);
			return successResponse({ res, data, code: 201 });
		} catch (e) {
			return errorResponse({ res, data: e });
		}
	};
	readReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const data = await this.readAll(
				{ id: req.query.id as string },
				new EmployeeCRUD(),
				["branch", "permissions", "user"]
			);
			return successResponse({ res, data });
		} catch (e) {
			return errorResponse({ res, data: e });
		}
	};
	updateReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const data = await this.update(req.body, new EmployeeCRUD());
			return successResponse({ res, data, code: 204 });
		} catch (e) {
			return errorResponse({ res, data: e });
		}
	};
	deleteReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const data = await this.delete(
				{ id: req.query.id as string },
				new EmployeeCRUD()
			);
			return successResponse({ res, data, code: 204 });
		} catch (e) {
			return errorResponse({ res, data: e });
		}
	};
}