import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ControllerFactory } from "./controller.factory";
import { PersonController } from "./person.controller";
import { Business } from "../models";
import { BusinessCRUD } from "./crud";
import { errorResponse, successResponse } from "../libraries/unified_response";
import { EntityManager, ObjectLiteral } from "typeorm";

export class BusinessController extends ControllerFactory<Business> {
	create = async (value: Business, em?: EntityManager): Promise<Business[]> => {
		if (!!!value.person) throw "person not provided while registering business";
		if (!!!value.name) throw "business name bot provided";
		if (!!!value.licence) throw "business licence not provided";

		// checking if incomming request has person.id than use it otherwise create new
		const person = value.person.id
			? value.person
			: (await new PersonController().create(value.person, em)).at(0);
		const v = (await new BusinessCRUD().create({ ...value, person }, em))?.at(0);
		if (!!!v) throw "unable to create business";
		return [{ ...value, ...v, person }];
	};

	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const data = await this.create(req.body);
			return successResponse({
				res: res,
				code: 201,
				data: data,
			});
		} catch (e) {
			return errorResponse({
				res: res,
				data: e,
			});
		}
	};
	readReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const b = (
				await this.read({ id: req.query.id as string }, new BusinessCRUD(), [
					"person",
				])
			).at(0);
			return successResponse({ res: res, code: 201, data: b });
		} catch (e) {
			return errorResponse({
				res: res,
				data: e,
			});
		}
	};
	updateReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const updatedBusiness = req.body as Business;
			if (!!!req.body.person.id)
				updatedBusiness.person = (
					await new PersonController().create(req.body.person)
				).at(0);
			const response = await this.update(updatedBusiness, new BusinessCRUD());
			return successResponse({
				res: res,
				code: 204,
				data: response,
			});
		} catch (e) {
			return errorResponse({ res: res, data: e });
		}
	};
	deleteReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const response = this.delete(
				{ id: req.query.id as string },
				new BusinessCRUD()
			);
			return successResponse({
				res: res,
				data: response,
			});
		} catch (e) {
			return errorResponse({ res, data: e });
		}
	};
}
