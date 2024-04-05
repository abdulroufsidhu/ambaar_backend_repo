import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Address, City, Country, Nationality, State } from "../../models/pg";
import { ControllerFactory } from "./controller.factory";
import {
	AddressCRUD,
	CityCRUD,
	ContactCRUD,
	CountryCRUD,
	EmailCRUD,
	NationalityCRUD,
	StateCRUD,
} from "./crud";
import {
	errorResponse,
	successResponse,
} from "../../libraries/unified_response";
import { Email } from "../../models/pg";
import { Contact } from "../../models/pg/contact";
import { EntityManager, ObjectLiteral } from "typeorm";
import { DataToCrudWrapper } from "./crud.factory";
import { Logger } from "../../libraries/logger";

export class EmailController extends DataToCrudWrapper<Email> {
	create = async (
		value: Email,
		entityManager?: EntityManager
	): Promise<Email> => {
		const v = (await new EmailCRUD().create(value, entityManager))?.at(0);
		if (!!!v) throw "unable to create email";
		return {...value, ...v};
	};
}
export class ContactController extends DataToCrudWrapper<Contact> {
	create = async (
		value: Contact,
		entityManager?: EntityManager
	): Promise<Contact> => {
		const v = (await new ContactCRUD().create(value, entityManager))?.at(0);
		if (!!!v) throw "unable to create contact";
		return {...value, ...v};
	};
}
export class NationalityController extends DataToCrudWrapper<Nationality> {
	create = async (
		value: Nationality,
		entityManager?: EntityManager
	): Promise<Nationality> => {
		if (!!!value.address) throw "address is missing from nationality";
		if (!!!value.nationalId) throw "nationalId is missing from nationality";
		let address: Address = value.address
		if (!value.address.id) {
			address = await new AddressController().create(
				value.address,
				entityManager
			);
		}
		const v = (
			await new NationalityCRUD().create({ ...value, address }, entityManager)
		)?.at(0);
		if (!!!v) throw "unable to create nationality";
		return {...value, ...v, address};
	};
}

class CountryController extends DataToCrudWrapper<Country> {
	create = async (
		value: Country,
		entityManager?: EntityManager
	): Promise<Country> => {
		const v = (await new CountryCRUD().create(value, entityManager))?.at(0);
		if (!!!v) throw "unable to create country";
		return {...value, ...v};
	};
}
class StateController extends DataToCrudWrapper<State> {
	create = async (
		value: State,
		entityManager?: EntityManager
	): Promise<State> => {
		const v = (await new StateCRUD().create(value, entityManager))?.at(0);
		if (!!!v) throw "unable to create State";
		return {...value, ...v};
	};
}
class CityController extends DataToCrudWrapper<City> {
	create = async (
		value: City,
		entityManager?: EntityManager
	): Promise<City> => {
		const v = (await new CityCRUD().create(value, entityManager))?.at(0);
		if (!!!v) throw "unable to create City";
		return {...value, ...v};
	};
}

export class AddressController extends ControllerFactory<Address> {
	async create(addr: Address, entityManager?: EntityManager): Promise<Address> {
		const country = await new CountryController().create(
			{
				name: addr.city?.state?.country?.name,
			},
			entityManager
		);
		Logger.d("address.controller.ts", "country->", country);
		if (!!!country) throw "unable to create country from " + addr;
		const state = await new StateController().create(
			{
				country,
				name: addr.city?.state?.name,
			},
			entityManager
		);
		Logger.d("address.controller.ts", "state->", state);
		if (!!!state) throw "unable to create state from " + addr;
		const city = await new CityController().create(
			{
				state,
				name: addr.city?.name,
			},
			entityManager
		);
		Logger.d("address.controller.ts", "city->", city);
		if (!!!city) throw "unable to create city from " + addr;
		const address = (await new AddressCRUD().create(
			{...addr, city},
			entityManager
		))?.at(0);
		Logger.d("address.controller.ts", "address->", address);
		if (!!!address) throw "unable to create addres from " + addr;
		return {...address, city};
	}
	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const response = await this.create(req.body as Address);
			return successResponse({
				res,
				code: 201,
				data: response,
			});
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
			const id = req.query.address_id as string | undefined;
			const cityId = req.query.city_id as string | undefined;
			let city = undefined;
			if (cityId) city = { id: cityId };
			const name = req.query.Address as string | undefined;
			const data = await this.read({ id, city, name }, new AddressCRUD());
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
			const addrCrud = new AddressCRUD();
			const cd = await this.create(req.body as Address); // update request can contain new data
			const data = this.update(cd, addrCrud);
			return successResponse({ res, data });
		} catch (e) {
			return errorResponse({ res, data: e });
		}
	};
	deleteReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		return errorResponse({
			res,
			message: "deletion of address line is not allowed",
		});
	};
}
