import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Email, Person, User } from "../../models/pg";
import { ControllerFactory } from "./controller.factory";
import jwt from "jsonwebtoken";
import { EmailCRUD, UserCRUD } from "./crud";
import { config } from "../../config/config";
import {
	errorResponse,
	successResponse,
} from "../../libraries/unified_response";
import { Logger } from "../../libraries/logger";
import { PersonController } from "./person.controller";
import { EmailController, NationalityController } from "./address.controller";
import { EntityManager, ObjectLiteral } from "typeorm";
import { AppDataSource } from "../../data_source";

export class UserController extends ControllerFactory<User> {
	create = async (value: User, entityManager?: EntityManager) => {
		if (entityManager) return this.runCreateInEntityManager(value, entityManager) // if already in transaction do not create one
		return await AppDataSource.transaction( async (em) => {
			return this.runCreateInEntityManager(value, em)
		});
	};
	private async runCreateInEntityManager(value: User, em: EntityManager) {
		if (!value.username) throw "username not provided to create user";
		if (!value.password) throw "password not provided to create user";
		if (!value.person) throw "person not provided to create user";
		if (!value.email) throw "email not provided to create user";
		if (!value.nationality) throw "nationality not provided to create user";
		const person = value.person.id ? value.person : await new PersonController().create(value.person, em);
		if (!person) throw "unable to create person with data " + value.person;
		Logger.d('user.controller.ts', "Person->", person)
		const email = value.email.id ? value.email : await new EmailController().create(value.email, em);
		if (!email) throw "unable to create contact";
		const nationality = value.nationality.id ? value.nationality : await new NationalityController().create(
			{...value.nationality, address: person.address }, em
		);
		if (!nationality) throw "nationality invalid";
		const createdUser = (
			await new UserCRUD().create({ ...value, person, email, nationality }, em)
		)?.at(0);
		if (!!!createdUser)
			throw "unable to create user with the provided data " + value;
		return createdUser;
	}
	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			Logger.d("user.controller", req.body);
			const user = await this.create(req.body);
			if (!user) throw "user not created";
			const u = await this.signWithToken(user.id);
			return successResponse({
				res: res,
				code: 201,
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

	readReq = async (
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
		const e = await new EmailController().read(
			{ value: email },
			new EmailCRUD()
		);
		if (!e) throw "email not found";

		const userCrud = new UserCRUD();
		const uw: Record<string, any> = {};
		uw[`email.id`] = e.id;
		const user = await userCrud.read({
			where: uw,
			select: ["id", "password"],
		});
		Logger.d("user.controller", "email: ", e, "user: ", user);
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

	changePasswordReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const { oldPassword, newPassword, self, } = req.body;
			if (!!!oldPassword) throw "old password not provided in the request"
			if (!!!newPassword) throw "new password not provided in the request"
			if (!!!self) throw "could not find authorized user attachment with the request"
			return await this.updatePassword (
				self,
				oldPassword,
				newPassword,
				res,
				next
			)
		} catch(e) {
			return errorResponse({res,data:e})
		}
	}

	updateReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const { user, ...updates } = req.body;
			return await this.userUpdates(user, updates, res, next);
		} catch (e) {
			return errorResponse({
				res: res,
				code: 500,
				data: e,
			});
		}
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

	deleteReq = async (
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
