import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Branch } from "../../models/pg";
import { ControllerFactory } from "./controller.factory";
import {
	errorResponse,
	successResponse,
} from "../../libraries/unified_response";
import { ObjectLiteral } from "typeorm";
import { BusinessController } from "./business.controller";
import { BranchCRUD, BusinessCRUD } from "./crud";
import {
	AddressController,
	ContactController,
	EmailController,
} from "./address.controller";

export class BranchController extends ControllerFactory<Branch> {
	create = async (value: Branch): Promise<ObjectLiteral> => {
		if (!!!value.email) throw "branch email not provided";
		if (!!!value.address) throw "branch address not provided";
		if (!!!value.business) throw "business info not provided along branch";
		if (!!!value.contact) throw "branch contact not provided";
		const email = await new EmailController().create(value.email);
		const address = await new AddressController().create(value.address);
		const business = await new BusinessController().create(value.business);
		const contact = await new ContactController().create(value.contact);
		const returnable = (
			await new BranchCRUD().create({
				...value,
				email,
				address,
				business,
				contact,
			})
		)?.at(0);
		if (!!!returnable) throw "error creating branch";
		return returnable;
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
			const data = await this.read({ id: req.query.id as string }, new BranchCRUD(), [
				"email",
				"address",
				"business",
				"contact",
			]);
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
			const data = await this.update(req.body, new BusinessCRUD());
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
			const data = await this.delete({id: req.query.id as string}, new BranchCRUD());
			return successResponse({ res, data, code: 204 });
		} catch (e) {
			return errorResponse({ res, data: e });
		}
	};
}
