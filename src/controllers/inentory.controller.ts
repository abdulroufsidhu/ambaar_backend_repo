import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { EntityManager } from "typeorm";
import { Inventory } from "../models";
import { ControllerFactory } from "./controller.factory";
import { InventoryCRUD } from "./crud";
import { AppDataSource } from "../data_source";
import { errorResponse, successResponse } from "../libraries/unified_response";

export class InventoryController extends ControllerFactory<Inventory> {
	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>> | undefined> => {
		try {
			const data = await AppDataSource.transaction(async e => {
				const item: Inventory = req.body
				return await this.create(item, e)
			})
			return successResponse({res, code: 201, data})
		} catch (error) {
			return errorResponse({res, data: error})
		}
	};
	readReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>> | undefined> => {
		throw new Error("Method not implemented.");
	};
	updateReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>> | undefined> => {
		throw new Error("Method not implemented.");
	};
	deleteReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>> | undefined> => {
		throw new Error("Method not implemented.");
	};
	create = async (
		value: Inventory,
		entityManager?: EntityManager | undefined
	): Promise<Inventory[]> => {
		if (!!!value.product?.id) throw Error("product id not supplied");
		if (!!!value.unitSellPrice) throw Error("unit sell price not supplied");
		if (!!!value.unitBuyPrice) throw Error("unit buy price supplied");
		if (!!!value.unitAllowedDiscount)
			throw Error("unit allowed discount not supplied");
		if (!!!value.branch?.id) throw Error("branch id not supplied");
		if (!!!value.availableQuantity)
			throw Error("available quantity not supplied");
		return await new InventoryCRUD().create(value, entityManager);
	};
}
