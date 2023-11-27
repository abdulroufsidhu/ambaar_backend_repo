import { NextFunction, Request, Response } from "express";
import { Product, IProduct } from "../models";
import { errorResponse, successResponse } from "../libraries/unified_response";

class ProductController {
  create = async (product: IProduct) => {
    const p = new Product({ ...product });
    return p.save().then((prod) => prod);
  };

  fromId = async (id: string) => Product.findById(id).then((p) => p);
  fromSerial = async (serial: string) =>
    Product.find({ serialNumber: serial }).then((p) => p);
  fromName = async (name: string) =>
    Product.find({ name: name }).then((p) => p);

  createReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IProduct = req.body;
    return this.create(body)
      .then((product) => res.status(201).json({ product }))
      .catch((error) => res.status(500).json({ error }));
  };

  readReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    const serial = req.query.serial_number;
    const name = req.query.name;
    if (typeof id === "string") {
      return this.fromId(id)
        .then((product) =>
          product
            ? successResponse({ res, data: product })
            : errorResponse({ res, code: 404, message: "product not found", data: {} })
        )
        .catch((error) => res.status(500).json({ error }));
    }
    if (typeof serial === "string") {
      return this.fromSerial(serial)
        .then((products) =>
          products
            ? successResponse({ res, data: [...products] })
            : errorResponse({ res, message: "product Not Found", data: {} })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    if (typeof name === "string") {
      return this.fromName(name)
        .then((products) =>
          products
            ? successResponse({ res, data: [...products] })
            : errorResponse({ res, message: "product Not Found", data: {} })
        )
        .catch((error) => res.status(500).json({ error }));
    }
    return errorResponse({ res, message: "Please make sure to provide, id, serial_number or name of the product", data: {} });
  };


  update = async (id: string, product: IProduct) => Product.findByIdAndUpdate(id, product).then(res => res)

  updateReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IProduct = req.body;
    return this.update(req.body._id, body)
      .then((product) => successResponse({ res, data: product }))
      .catch((error) => errorResponse({ res, data: error }));
  };
}

const productController = new ProductController()
export default productController;
