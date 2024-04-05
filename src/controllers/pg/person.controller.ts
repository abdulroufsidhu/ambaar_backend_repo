import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ControllerFactory } from "./controller.factory";
import { AddressCRUD, ContactCRUD, PersonCRUD } from "./crud";
import { Logger } from "../../libraries/logger";
import {
	errorResponse,
	successResponse,
} from "../../libraries/unified_response";
import { Person } from "../../models/pg";
import { EntityManager, ObjectLiteral } from "typeorm";
import { AddressController, ContactController } from "./address.controller";
import { Address } from '../../models/pg/address';

export class PersonController extends ControllerFactory<Person> {
	create = async (
		value: Person,
		entityManager?: EntityManager
	): Promise<ObjectLiteral> => {
		if (!value.contact) throw "contact not provided to create person";
		if (!value.address) throw "address not provided to create person";
		if (!value.name) throw "name not provided to create person";
		const contact = await new ContactController().create(
			value.contact,
			entityManager
		);
		if (!contact) throw "contact missing";
		const address = await new AddressController().create(
			value.address,
			entityManager
		);
		if (!address) throw "address missing";
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
		if (!person) throw "unable to record person";
		return {...value, ...person, address, contact};
	};
	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const person = await this.create(req.body);
			if (!person) throw "unable to create person with data " + req.body;
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
			const person = await this.readAll(
				{ id: req.query.pid as string },
				new PersonCRUD(),
				["contact", "address"]
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
