import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ControllerFactory } from "./controller.factory";
import { errorResponse, successResponse } from "../libraries/unified_response";
import { BusinessController } from "./business.controller";
import { BranchCRUD, BusinessCRUD, PermissionCRUD } from "./crud";
import {
	AddressController,
	ContactController,
	EmailController,
} from "./address.controller";
import { EmployeeController } from "./employee.controller";
import { PermissionController } from "./permission.controller";
import { Branch } from "../models/business";
import { EntityManager } from "typeorm";
import { AppDataSource } from "../data_source";
import { Logger } from "../libraries/logger";

export class BranchController extends ControllerFactory<Branch> {
	create = async (value: Branch, em?: EntityManager): Promise<Branch[]> => {
		if (!!!value.email) throw "branch email not provided";
		if (!!!value.address) throw "branch address not provided";
		if (!!!value.business) throw "business info not provided along branch";
		if (!!!value.contact) throw "branch contact not provided";
		if (!!!value.code) throw "branch code not provided";
		if (!!!value.name) throw "branch name not provided";

		// these ternaries simply mean that if the incomming object has id map it otherwise create new database entry
		const email = value.email.id
			? value.email
			: (await new EmailController().create(value.email, em)).at(0);
		const address = value.address.id
			? value.address
			: (await new AddressController().create(value.address, em)).at(0);
		const business = value.business.id
			? value.business
			: (await new BusinessController().create(value.business, em)).at(0);
		const contact = value.contact.id
			? value.contact
			: (await new ContactController().create(value.contact, em)).at(0);
		const returnable = (
			await new BranchCRUD().create({
				...value,
				email,
				address,
				business,
				contact,
			}, em)
		)?.at(0);
		if (!!!returnable) throw "error creating branch";

		return [{ ...returnable, email, address, business, contact, code: value.code, name: value.name }];
	};

	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>> | undefined> => {
		try {
			const data = await AppDataSource.transaction(async em =>{
				const b = (await this.create(req.body, em)).at(0);
				const empInfo = {
					branch : b,
					permissions : 
					await new PermissionController().read(
						{},
						new PermissionCRUD(),
						undefined,
						undefined,
						em
					),
					role : "creator",
					user : {
						id: req.body.self,
					}
				}
				return await new EmployeeController().create(empInfo, em);
			})
			return successResponse({ res, data, code: 201 });
			// return successResponse({ res, data, code: 201 });
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
				new BranchCRUD(),
				["email", "address", "business", "contact"]
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
			const data = await this.delete(
				{ id: req.query.id as string },
				new BranchCRUD()
			);
			return successResponse({ res, data, code: 204 });
		} catch (e) {
			return errorResponse({ res, data: e });
		}
	};
}
