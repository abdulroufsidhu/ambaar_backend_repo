import { Request, Response, NextFunction } from "express";
import { IInventory, Inventory } from "../models";
import { productController } from ".";

const create = async (inventory: IInventory) => {
  return productController
    .create(inventory.product)
    .then((product) =>
      new Inventory({ ...inventory, product: product._id })
        .save()
        .then((inv) => inv)
    );
};

const fromId = async (id: string) =>
  Inventory.findById(id)
    .populate(["product", "branch"])
    .then((inv) => inv);
const fromProduct = async (product_id: string, branch_id: string) =>
  Inventory.find({ product: product_id, branch: branch_id })
    .populate(["product", "branch"])
    .then((inv) => inv);
const fromBranch = async (branch_id: string) =>
  Inventory.find({ branch: branch_id })
    .populate(["product", "branch"])
    .then((inv) => inv);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IInventory = req.body;
  console.info(body);
  return create(body)
    .then((inventory) => res.status(201).json({ inventory }))
    .catch((error) => res.status(500).json({ error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const product_id = req.query.product_id;
  const branch_id = req.query.branch_id;
  if (typeof id === "string") {
    return fromId(id)
      .then((inventory) =>
        inventory
          ? res.status(200).json({ inventory })
          : res.status(404).json({ message: "no data found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof product_id === "string") {
    if (typeof branch_id === "string") {
      return fromProduct(product_id, branch_id)
        .then((inventory) =>
          inventory
            ? res.status(200).json({ inventory })
            : res.status(404).json({ message: "no data found" })
        )
        .catch((error) => res.status(500).json({ error }));
    } else {
      return res.status(500).json({
        message: "Be sure to provide branch_id if you provide product_id",
      });
    }
  }
  if (typeof branch_id === "string") {
    return fromBranch(branch_id)
      .then((inventory) =>
        inventory
          ? res.status(200).json([...inventory])
          : res.status(404).json({ message: "no data found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  return res
    .status(500)
    .json({ message: "Be sure to provide id, product_id or branch_id" });
};

const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IInventory = req.body;
  return Inventory.findByIdAndUpdate(req.body._id, body)
    .then((inventory) => res.status(204).json({ ...inventory }))
    .catch((error) => res.status(500).json({ error }));
};

export default {
  create,
  fromId,
  fromProduct,
  fromBranch,
  createReq,
  readReq,
  updateReq,
};
