import { NextFunction, Request, Response } from "express";
import { Product, IProduct } from "../models";
import { errorResponse, successResponse } from "../libraries/unified_response";

const create = async (product: IProduct) => {
  const p = new Product({ ...product });
  return p.save().then((prod) => prod);
};

const fromId = async (id: string) => Product.findById(id).then((p) => p);
const fromSerial = async (serial: string) =>
  Product.find({ serialNumber: serial }).then((p) => p);
const fromName = async (name: string) =>
  Product.find({ name: name }).then((p) => p);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IProduct = req.body;
  return create(body)
    .then((product) => res.status(201).json({ product }))
    .catch((error) => res.status(500).json({ error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const serial = req.query.serial_number;
  const name = req.query.name;
  if (typeof id === "string") {
    return fromId(id)
      .then((product) =>
        product
          ? successResponse({ res, data: product })
          : errorResponse({ res, code: 404, message: "product not found", data: {} })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof serial === "string") {
    return fromSerial(serial)
      .then((products) =>
        products
          ? successResponse({ res, data: [...products] })
          : errorResponse({ res, message: "product Not Found", data: {} })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  if (typeof name === "string") {
    return fromName(name)
      .then((products) =>
        products
          ? successResponse({ res, data: [...products] })
          : errorResponse({ res, message: "product Not Found", data: {} })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  return errorResponse({ res, message: "Please make sure to provide, id, serial_number or name of the product", data: {} });
};


const update = async (id: string, product: IProduct) => Product.findByIdAndUpdate(id, product).then(res => res)

const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IProduct = req.body;
  return update(req.body._id, body)
    .then((product) => successResponse({ res, data: product }))
    .catch((error) => errorResponse({ res, data: error }));
};

export default {
  create,
  fromId,
  fromName,
  fromSerial,
  createReq,
  readReq,
  update,
  updateReq,
};
