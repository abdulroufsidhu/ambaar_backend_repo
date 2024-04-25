import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ControllerFactory } from "./controller.factory";
import { PersonCRUD } from "./crud";
import { Logger } from "../libraries/logger";
import { errorResponse, successResponse } from "../libraries/unified_response";
import { Person } from "../models";
import { EntityManager, ObjectLiteral } from "typeorm";
import { AddressController, ContactController } from "./address.controller";
import { AppDataSource } from "../data_source";

export class PersonController extends ControllerFactory<Person> {
	create = async (
		value: Person,
		entityManager?: EntityManager
	): Promise<Person[]> => {
		if (!value.contact) throw Error("contact not provided to create person");
		if (!value.address) throw Error("address not provided to create person");
		if (!value.name) throw Error("name not provided to create person");
		let contact = !!value.contact?.id
			? value.contact
			: (
					await new ContactController().create(value.contact, entityManager)
			  )?.at(0);
		if (!contact) throw Error("unable to create or retrieve contact");
		const address = !!value.address?.id
			? value.address
			: (await new AddressController().create(value.address, entityManager)).at(
					0
			  );
		if (!address) throw Error("address missing");
		const pName = value.name;
		const person = (
			await new PersonCRUD().create(
				{
					address,
					contact,
					name: pName,
				},
				entityManager
			)
		)?.at(0);
		if (!person) throw Error("unable to record person");
		return [{ ...value, ...person, address, contact }];
	};
	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const person = await AppDataSource.transaction(async (em) => {
				const person = await this.create(req.body, em);
				if (!person) throw Error("unable to create person with data ") + req.body;
				return person;
			});
			return successResponse({
				res: res,
				code: 201,
				data: person,
			});
		} catch (e) {
			Logger.w("person.controller", e);
			return errorResponse({
				res: res,
				code: 500,
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
			let condition: Person | undefined = undefined
			if (!!req.query.p_name) {
				condition = {
					name: req.query.p_name as string
				}
			}
			if (!!req.query.pid) {
				condition = {
					id: req.query.pid as string
				}
			}
			const person = (
				await this.read(condition, new PersonCRUD(), [
					"contact",
					"address",
				])
			);
			return successResponse({
				res: res,
				code: 200,
				data: person,
			});
		} catch (e) {
			return errorResponse({
				res: res,
				code: 500,
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
			const response = await this.update(req.body as Person, new PersonCRUD());
			return successResponse({
				res: res,
				code: 204,
				data: response,
			});
		} catch (e) {
			return errorResponse({
				res: res,
				code: 500,
				data: e,
			});
		}
	};
	deleteReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		return errorResponse({
			res: res,
			code: 500,
			message: "person cannot be deleted",
		});
	};
}
