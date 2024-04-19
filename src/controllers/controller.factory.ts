import { NextFunction, Request, Response } from "express";
import { ObjectLiteral } from "typeorm";
import {  DataToCrudWrapper } from "./crud.factory";

export abstract class ControllerFactory<
	Type extends Record<string, any> | ObjectLiteral
> extends DataToCrudWrapper<Type> {
	abstract createReq(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>|undefined>;
	abstract readReq(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>|undefined>;
	abstract updateReq(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>|undefined>;
	abstract deleteReq(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>|undefined>;
}
