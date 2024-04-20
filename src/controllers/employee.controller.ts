import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ControllerFactory } from "./controller.factory";
import { EntityManager, ObjectLiteral } from "typeorm";
import { errorResponse, successResponse } from "../libraries/unified_response";
import { Employee, Permission } from "../models";
import { UserController } from "./user.controller";
import { BranchController } from "./branch.controller";
import { EmployeeCRUD } from "./crud";
import { AppDataSource } from "../data_source";
import { Logger } from "../libraries/logger";

export class EmployeeController extends ControllerFactory<Employee> {
	create = async (value: Employee, entityManager?: EntityManager) => {
		if (!!entityManager)
			return this.runCreateInTransaction(value, entityManager);
		return AppDataSource.transaction((em) =>
			this.runCreateInTransaction(value, em)
		);
	};

	private async runCreateInTransaction(value: Employee, em: EntityManager) {
		if (!!!value.user) throw "no user info while creating employee";
		if (!!!value.branch) throw "no branch info while creating employee";
		if (!!!value.permissions)
			throw "no permissions supplied while adding employee";
		if (!!!value.role) throw "no role supplied while adding employee";
		const user = value.user.id
			? value.user
			: (await new UserController().create(value.user, em)).at(0);
		const branch = value.branch.id
			? value.branch
			: (await new BranchController().create(value.branch, em)).at(0);
		const permissions = value.permissions;

		Logger.d("employee.controller.ts", "create-> permissions", permissions);

		const e = !!value.id
			? value
			: (
					await new EmployeeCRUD().create(
						{
							...value,
							user,
							branch,
							permissions: permissions,
						},
						em
					)
			  )?.at(0);
		if (!!!e) throw "unable to create employee with data " + value;
		return [{ ...e, user, branch, permissions }];
	}

	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			Logger.d("employee.controller.ts", "createReq->req.body:, ", req.body);
			const data = await this.create(req.body);
			return successResponse({ res, data, code: 201 });
		} catch (e) {
			return errorResponse({ res, data: e });
		}
	};

	selfEmployeementsReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const data = await this.read(
				{ user: { id: req.body.self } },
				new EmployeeCRUD(),
				["branch", "permissions", "user"]
			);
			return successResponse({ res, data });
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
			const data = await this.read(
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
