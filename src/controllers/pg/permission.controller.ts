import { ObjectLiteral } from "typeorm";
import { Permission } from "../../models/pg";
import { ControllerFactory } from "./controller.factory";
import { EmployeeCRUD, PermissionCRUD } from "./crud";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import {
	errorResponse,
	successResponse,
} from "../../libraries/unified_response";

export class PermissionController extends ControllerFactory<Permission> {
	create = async (value: Permission): Promise<ObjectLiteral> => {
		if (!!!value.name) throw "permission name not provided while adding one";
		const p = (await new PermissionCRUD().create(value))?.at(0);
		if (!!!p) throw "unable to create permission " + value;
		return p;
	};

    async createAll(values: Permission[]): Promise<ObjectLiteral[]> {
        return await values.map((p,i,a)=>this.create(p))
    }

	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const data = this.create(req.body);
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
				new PermissionCRUD()
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
			const data = await this.update(req.body, new PermissionCRUD());
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
            const data = await this.delete({id: req.query.id as string}, new PermissionCRUD())
            return successResponse({res,data, code:204})
		} catch (e) {
			return errorResponse({ res, data: e });
		}
    };
}
