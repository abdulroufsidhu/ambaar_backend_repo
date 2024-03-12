import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { User } from "../../models/pg";
import { ControllerFacoty } from "./controller.factory";
import jwt from "jsonwebtoken";
import {
	AddressCRUD,
	CityCRUD,
	ContactCRUD,
	CountryCRUD,
	EmailCRUD,
	NationalityCRUD,
	PersonCRUD,
	StateCRUD,
	UserCRUD,
} from "./crud";
import { config } from "../../config/config";
import {
	errorResponse,
	successResponse,
} from "../../libraries/unified_response";
import { Logger } from "../../libraries/logger";
import user from "../../models/mongo/user";
import uniqueValidator from "mongoose-unique-validator";

class UserController extends ControllerFacoty {
	create = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const name: string = req.body.name;
			const username: string = req.body.username;

			const emailRequest = await new EmailCRUD().create({
				value: req.body.email,
			});
			const email = Array.isArray(emailRequest)
				? emailRequest[0]
				: emailRequest;

			const contactRequest = await new ContactCRUD().create({
				value: req.body.contact,
			});
			const contact = Array.isArray(contactRequest)
				? contactRequest[0]
				: contactRequest;

			const countryRequest = await new CountryCRUD().create({
				name: req.body.country,
			});
			const contry = Array.isArray(countryRequest)
				? countryRequest[0]
				: countryRequest;

			if (!contry) throw "country not found";

			const stateRequest = await new StateCRUD().create({
				name: req.body.state,
				country: contry,
			});
			const state = Array.isArray(stateRequest)
				? stateRequest[0]
				: stateRequest;
			if (!state) throw "state not found";

			const cityRequest = await new CityCRUD().create({
				name: req.body.city,
				state: state,
			});
			const city = Array.isArray(cityRequest) ? cityRequest[0] : cityRequest;
			if (!city) throw "city not found";

			const addressRequest = await new AddressCRUD().create({
				name: req.body.address,
				city: city,
			});
			const address = Array.isArray(addressRequest)
				? addressRequest[0]
				: addressRequest;
			if (!address) throw "address not found";

			if (!contact) throw "contact not found";

			const personRequest = await new PersonCRUD().create({
				address: address,
				name: name,
				contact: contact,
			});
			const person = Array.isArray(personRequest)
				? personRequest[0]
				: personRequest;

			const nationalityRequest = await new NationalityCRUD().create({
				nationalId: req.body.nationality,
				address: address,
			});
			const nationality = Array.isArray(nationalityRequest)
				? nationalityRequest[0]
				: nationalityRequest;

			if (!email) throw "email not found";
			if (!person) throw "person not found";
			if (!nationality) throw "nationality invalid";

			const userCrud = new UserCRUD();
			const userRequest = await userCrud.create({
				username: username,
				email: email,
				person: person,
				nationality: nationality,
				password: req.body.password,
			});
			const user = Array.isArray(userRequest) ? userRequest[0] : userRequest;
			if (!user) throw "user not created";
			const u = await this.signWithToken(user.id);
			return successResponse({
				res: res,
				code: 201,
				message: "user created successfully",
				data: u,
			});
		} catch (error) {
			Logger.w("user.controller", error);
			return errorResponse({
				res: res,
				code: 500,
				message: "internal server error",
				data: error,
			});
		}
	};

	signWithToken = async (userId?: string): Promise<User> => {
		const userCrud = new UserCRUD();
		const userRequest = await userCrud.read({
			where: { id: userId },
			select: [
				"id",
				"username",
				"email",
				"person",
				"nationality",
				"token",
				"createdAt",
				"updatedAt",
			],
			relations: ["person", "nationality", "email"],
		});
		if (!userRequest) throw "no user found while signing";
		const user = userRequest[0];
		if (!user.id) throw "user id not found";
		const token = jwt.sign(user.id, config.JWT.key);

		user.token = token;

		await userCrud.update(user);
		return user;
	};

	read = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const emailInQuery: string = req.query.email as string;
			const passwordInQuery: string = req.query.password as string;
			if (emailInQuery && passwordInQuery) {
				return await this.login(emailInQuery, passwordInQuery, res, next);
			}
			return await this.view(req.query.uid as string, res, next);
		} catch (error) {
			Logger.w("user.controller", error);

			return errorResponse({
				res: res,
				code: 500,
				message: "error occured",
				data: error,
			});
		}
	};

	private view = async (
		id: string,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		const userCrud = new UserCRUD();
		if (!id) throw "no uid provided";
		const user = (
			await userCrud.read({ where: { id: id }, relations: ["person"] })
		)?.map((v) => {
			delete v.token;
			delete v.password;
			return v;
		});
		if (!user) throw "user not found";
		return successResponse({
			res: res,
			code: 200,
			message: "user found to be viewed",
			data: user[0],
		});
	};

	private login = async (
		email: string,
		password: string,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		const emailObj = await new EmailCRUD().read({ where: { value: email } });
		if (!emailObj) throw "email not found";
		if (emailObj.length < 1) throw "email not found";
		const userCrud = new UserCRUD();
		const uw: Record<string, any> = {};
		uw[`email.id`] = emailObj[0].id;
		const user = await userCrud.read({
			where: uw,
			select: ["id", "password"],
		});
		Logger.d("user.controller", "email: ", emailObj, "user: ", user);
		if (!user) throw "user not found";
		if (user.length < 1) throw "user not found";
		const passwordCorrect = await User.comparePassword(
			password,
			user[0].password
		);
		if (passwordCorrect) {
			const u = await this.signWithToken(user[0].id);
			return successResponse({
				res: res,
				code: 200,
				message: "user logged in successfully",
				data: u,
			});
		}
		throw "invalid password";
	};

	update = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		const { oldPassword, newPassword, user, ...updates } = req.body;
		if (oldPassword && newPassword && user) {
			return this.updatePassword(user, oldPassword, newPassword, res, next);
		}
		return this.userUpdates(user, updates, res, next);
	};

	private userUpdates = async (
		user: User,
		{ password, ...updates }: User,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		const userCrud = new UserCRUD();
		await userCrud.update({ id: user.id, ...updates });
		return successResponse({
			res: res,
			code: 204,
			message: "user updated successfully",
			data: { user, ...updates },
		});
	};

	private updatePassword = async (
		user: User,
		oldPassword: string,
		newPassword: string,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		const passwordMatches = await User.comparePassword(
			oldPassword,
			user.password
		);
		if (!passwordMatches) throw "old password is incorrect";
		const userCrud = new UserCRUD();
		await userCrud.update({ ...user, password: newPassword });
		return successResponse({
			res: res,
			code: 204,
			message: "password changed successfully",
			data: user,
		});
	};

	delete = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		return errorResponse({
			res: res,
			code: 400,
			message: "user deletion is not allowed",
		});
	};
}

const userController = new UserController();

export default userController;
