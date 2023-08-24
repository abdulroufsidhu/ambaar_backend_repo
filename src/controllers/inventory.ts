import { Request, Response, NextFunction } from "express";
import { IInventory, Inventory } from "../models";
import { productController } from ".";
import { Logger } from "../libraries/logger";
import { errorResponse, successResponse } from "../libraries/unified_response";

const create = async (inventory: IInventory) => {
  return productController
    .create(inventory.product)
    .then((product) =>
      new Inventory({ ...inventory, product: product._id })
        .save()
        .then(
          (inv) => inv.populate(
            [
              {
                path: "branch",
                populate: {
                  path: "business",
                  model: "Business",
                },
              },
              { path: "product" }
            ]
          )
        )
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
  return create(body)
    .then((inventory) => successResponse({ res, data: inventory }))
    .catch((error) => errorResponse({ res, data: error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const product_id = req.query.product_id;
  const branch_id = req.query.branch_id;
  if (typeof id === "string") {
    return fromId(id)
      .then((inventory) =>
        inventory
          ? successResponse({ res, data: inventory })
          : errorResponse({ res, code: 404, message: "no data found", data: {} })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof product_id === "string") {
    if (typeof branch_id === "string") {
      return fromProduct(product_id, branch_id)
        .then((inventory) =>
          inventory
            ? successResponse({ res, data: inventory })
            : errorResponse({ res, code: 404, message: "no data found", data: {} })
        )
        .catch((error) => res.status(500).json({ error }));
    } else {
      return errorResponse({ res, message: "Be sure to provide branch_id if you provide product_id", data: {} })
    }
  }
  if (typeof branch_id === "string") {
    return fromBranch(branch_id)
      .then((inventory) =>
        inventory
          ? successResponse({ res, data: [...inventory] })
          : errorResponse({ res, code: 404, message: "no data found", data: {} })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  return errorResponse({ res, message: "Be sure to provide id, product_id or branch_id", data: {} })
};

const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IInventory = req.body;
  return productController.update(req.body.product._id, body.product)
    .then(inventory => successResponse({ res, data: inventory }))
    .catch(error => errorResponse({ res, data: error }));
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
