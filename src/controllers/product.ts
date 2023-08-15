import { NextFunction, Request, Response } from "express";
import { Product, IProduct } from "../models";

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
          ? res.status(200).json({ product })
          : res.status(404).json({ message: "Product Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof serial === "string") {
    return fromSerial(serial)
      .then((products) =>
        products
          ? res.status(200).json([...products])
          : res.status(404).json({ message: "Product Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof name === "string") {
    return fromName(name)
      .then((products) =>
        products
          ? res.status(200).json([...products])
          : res.status(404).json({ message: "Product Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  return res.status(500).json({
    error:
      "Please make sure to provide, id, serial_number or name of the product",
  });
};

const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IProduct = req.body;
  return Product.findByIdAndUpdate(req.body._id, body)
    .then((product) => res.status(204).json({ product }))
    .catch((error) => res.status(500).json({ error }));
};

export default {
  create,
  fromId,
  fromName,
  fromSerial,
  createReq,
  readReq,
  updateReq,
};
