import { Request, Response, NextFunction } from "express";
import { IInventory, Inventory } from "../../models/mongo";
import { productController } from ".";
import { errorResponse, successResponse } from "../../libraries/unified_response";

class InventoryController {
  create = async (inventory: IInventory) => {
    return productController.create(inventory.product).then((product) =>
      new Inventory({ ...inventory, product: product._id }).save().then((inv) =>
        inv.populate([
          {
            path: "branch",
            populate: {
              path: "business",
              model: "Business",
            },
          },
          { path: "product" },
        ])
      )
    );
  };

  increamentQuantity = async (id: string, increament: number) =>
    Inventory.findByIdAndUpdate(
      id,
      { $inc: { quantity: increament } },
      { new: true }
    )
      .then((res) => res);

  update = async (id: string, inventory: IInventory) =>
    Inventory.findByIdAndUpdate(id, inventory, { new: true }).then((res) => res);

  fromId = async (id: string) =>
    Inventory.findById(id)
      .populate(["product", "branch"])
      .then((inv) => inv);
  fromProduct = async (product_id: string, branch_id: string) =>
    Inventory.find({ product: product_id, branch: branch_id })
      .populate(["product", "branch"])
      .then((inv) => inv);
  fromBranch = async (branch_id: string) =>
    Inventory.find({ branch: branch_id })
      .populate(["product", "branch"])
      .then((inv) => inv);

  createReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IInventory = req.body;
    return this.create(body)
      .then((inventory) => successResponse({ res, data: inventory }))
      .catch((error) => errorResponse({ res, data: error }));
  };

  readReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    const product_id = req.query.product_id;
    const branch_id = req.query.branch_id;
    if (typeof id === "string") {
      return this.fromId(id)
        .then((inventory) =>
          inventory
            ? successResponse({ res, data: inventory })
            : errorResponse({
              res,
              code: 404,
              message: "no data found",
              data: {},
            })
        )
        .catch((error) => res.status(500).json({ error }));
    }
    if (typeof product_id === "string") {
      if (typeof branch_id === "string") {
        return this.fromProduct(product_id, branch_id)
          .then((inventory) =>
            inventory
              ? successResponse({ res, data: inventory })
              : errorResponse({
                res,
                code: 404,
                message: "no data found",
                data: {},
              })
          )
          .catch((error) => res.status(500).json({ error }));
      } else {
        return errorResponse({
          res,
          message: "Be sure to provide branch_id if you provide product_id",
          data: {},
        });
      }
    }
    if (typeof branch_id === "string") {
      return this.fromBranch(branch_id)
        .then((inventory) =>
          inventory
            ? successResponse({ res, data: [...inventory] })
            : errorResponse({
              res,
              code: 404,
              message: "no data found",
              data: {},
            })
        )
        .catch((error) => res.status(500).json({ error }));
    }
    return errorResponse({
      res,
      message: "Be sure to provide id, product_id or branch_id",
      data: {},
    });
  };

  updateReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IInventory = req.body;
    return productController
      .update(req.body.product._id, body.product)
      .then((product) => this.update(req.body._id, body).then((inventory) => successResponse({ res, data: inventory })
      ))
      .catch((error) => errorResponse({ res, data: error }));
  };
}

const inventoryController = new InventoryController()
export default inventoryController;

