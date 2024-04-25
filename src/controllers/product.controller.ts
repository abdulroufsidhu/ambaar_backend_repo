import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Product } from "../models";
import { ControllerFactory } from "./controller.factory";
import { EntityManager } from "typeorm";
import { errorResponse, successResponse } from "../libraries/unified_response";
import { ProductCRUD } from "./crud";
import { AppDataSource } from "../data_source";

export class ProductController extends ControllerFactory<Product> {
	create = async (
		value: Product,
		entityManager?: EntityManager | undefined
	): Promise<Product[]> => {
        if (!!!value.name) throw Error("Product Name not provided")
        if (!!!value.detail) throw Error("Product Details not provided")
        if (!!!value.variant) throw Error("Product Variant not provided")
        if (!!!value.color) throw Error("Product Color not provided")
        return await new ProductCRUD().create(
            value,
            entityManager
        )
    };
	createReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>> | undefined> => {
        try {
            return await AppDataSource.transaction(async (em) => {
                const data = await this.create(req.body, em )
                return successResponse({res, code: 201, data})
            })
        } catch (e) {
            return errorResponse({
                res,
                data: e
            })
        }
    };
	readReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>> | undefined> => {
        try {
            const reqData: Product = {
                id: req.query.pid as string | undefined,
                name: req.query.name as string | undefined,
                color: req.query.color as string | undefined,
                variant: req.query.variant as string | undefined
            };
            const data = await this.read(reqData, new ProductCRUD())
            return successResponse({res, code: 200, data})
        } catch (e) {
            return errorResponse({res, data: e})
        }
    };
	updateReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>> | undefined> => {
        try {
            const data = await this.update(req.body, new ProductCRUD())
            return successResponse({res, code: 204, data})
        } catch (e) {
            errorResponse({res, data:e})
        }
    };
	deleteReq = async (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response<any, Record<string, any>> | undefined> => {
        return errorResponse({res, message: "Product cannot be deleted"})
    };
}
