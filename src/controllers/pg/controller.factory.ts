import { NextFunction, Request, Response } from "express";

export abstract class ControllerFacoty {
	abstract create(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>>;
	abstract read(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>>;
	abstract update(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>>;
	abstract delete(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<any, Record<string, any>>>;
}
