import { Request, Response, NextFunction } from "express";
import { IOperation, IPerson, Operation } from "../models";
import { inventoryController } from ".";
import { Logger } from "../libraries/logger";
import { errorResponse, successResponse } from "../libraries/unified_response";
import { personController } from ".";
import mongoose from "mongoose";

class OperationController {
  create = async (operation: IOperation) => {
    return personController.create(operation.person).then((person) =>
      Operation.create({ ...operation, person: person._id }).then((res) =>
        res.populate([
          {
            path: "inventory",
            populate: {
              path: "branch",
              populate: "business"
            }
          },
          { path: "person" }
        ]).then(op => {
          const increament =
            operation.action === "sale" ? -operation.quantity : operation.quantity;
          return inventoryController
            .increamentQuantity(res.inventory._id, increament)
            .then((inv) => {
              return op;
            });
        })
      )
    );
  };

  fromId = async (id: string) =>
    Operation.findById(id)
      .populate([
        { path: "inventory", populate: { path: "branch" } },
        { path: "user", populate: { path: "user" } }
      ])
      .then((inv) => inv);

  fromBranch = (branchId: string) => Operation.aggregate([
    {
      $lookup: {
        from: 'inventories', // Replace with the actual name of your Inventory collection
        localField: 'inventory',
        foreignField: '_id',
        as: 'inventory',
      },
    },
    {
      $unwind: '$inventory',
    },
    {
      $lookup: {
        from: 'branches', // Replace with the actual name of your Branch collection
        localField: 'inventory.branch',
        foreignField: '_id',
        as: 'inventory.branch',
      },
    },
    {
      $unwind: '$inventory.branch',
    },
    {
      $lookup: {
        from: 'businesses', // Replace with the actual name of your Branch collection
        localField: 'inventory.branch.business',
        foreignField: '_id',
        as: 'inventory.branch.business',
      },
    },
    {
      $unwind: '$inventory.branch.business',
    },
    {
      $lookup: {
        from: 'products', // Replace with the actual name of your Branch collection
        localField: 'inventory.product',
        foreignField: '_id',
        as: 'inventory.product',
      },
    },
    {
      $unwind: '$inventory.product',
    },
    {
      $match: {
        'inventory.branch._id': new mongoose.Types.ObjectId(branchId),
      },
    },
    {
      $lookup: {
        from: 'employees', // Replace with the actual name of your Employee collection
        localField: 'employee',
        foreignField: '_id',
        as: 'employee',
      },
    },
    {
      $unwind: '$employee',
    },
    {
      $lookup: {
        from: 'people', // Replace with the actual name of your Person collection
        localField: 'person',
        foreignField: '_id',
        as: 'person',
      },
    },
    {
      $unwind: '$person',
    },
  ]);

  fromProduct = async (branchId: string, productName: string) =>
    Operation.aggregate([
      {
        $lookup: {
          from: 'inventories', // Replace with the actual name of your Inventory collection
          localField: 'inventory',
          foreignField: '_id',
          as: 'inventory',
        },
      },
      {
        $unwind: '$inventory',
      },
      {
        $lookup: {
          from: 'branches', // Replace with the actual name of your Branch collection
          localField: 'inventory.branch',
          foreignField: '_id',
          as: 'inventory.branch',
        },
      },
      {
        $unwind: '$inventory.branch',
      },
      {
        $lookup: {
          from: 'businesses', // Replace with the actual name of your Branch collection
          localField: 'inventory.branch.business',
          foreignField: '_id',
          as: 'inventory.branch.business',
        },
      },
      {
        $unwind: '$inventory.branch.business',
      },
      {
        $lookup: {
          from: 'products', // Replace with the actual name of your Branch collection
          localField: 'inventory.product',
          foreignField: '_id',
          as: 'inventory.product',
        },
      },
      {
        $unwind: '$inventory.product',
      },
      {
        $match: {
          'inventory.branch._id': new mongoose.Types.ObjectId(branchId),
          'inventory.product.name': productName,
        },
      },
      {
        $lookup: {
          from: 'employees', // Replace with the actual name of your Employee collection
          localField: 'employee',
          foreignField: '_id',
          as: 'employee',
        },
      },
      {
        $unwind: '$employee',
      },
      {
        $lookup: {
          from: 'people', // Replace with the actual name of your Person collection
          localField: 'person',
          foreignField: '_id',
          as: 'person',
        },
      },
      {
        $unwind: '$person',
      },
    ]);

  fromPerson = async (field: string, value: string) => {
    const fieldPath = "person." + field;
    return Operation.find({
      fieldPath: value,
    })
      .populate("inventory.branch")
      .populate("employee.user")
      .exec()
      .then((operations) => [...operations]);
  };

  update = async (id: string, operation: IOperation) =>
    Operation.findByIdAndUpdate(id, operation).exec();

  createReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IOperation = req.body;
    return this.create(body)
      .then((operation) => successResponse({ res, data: operation }))
      .catch((error) => errorResponse({ res, data: error }));
  };

  readReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    const branchId = req.query.branch_id;
    const productName = req.query.product_name;
    const personName = req.query.name;
    const personContact = req.query.contact;
    const personEmail = req.query.email;
    const personNationalId = req.query.national_id;
    if (typeof id === "string") {
      return this.fromId(id)
        .then((operation) =>
          operation
            ? successResponse({ res, data: operation })
            : errorResponse({
              res,
              code: 404,
              message: "no data found",
              data: {},
            })
        )
        .catch((error) => res.status(500).json({ error }));
    }
    if (typeof productName === "string") {
      if (typeof branchId === "string") {
        return this.fromProduct(branchId, productName)
          .then((operation) =>
            operation
              ? successResponse({ res, data: operation })
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
    if (typeof branchId === "string") {
      Logger.i('operation', "finding for branch id")
      return this.fromBranch(branchId)
        .then((operation) =>
          operation
            ? successResponse({ res, data: [...operation] })
            : errorResponse({
              res,
              code: 404,
              message: "no data found",
              data: {},
            })
        )
        .catch((error) => res.status(500).json({ error }));
    }
    if (typeof personName === "string") {
      return this.fromPerson("name", personName)
        .then((operation) =>
          operation
            ? successResponse({ res, data: [...operation] })
            : errorResponse({
              res,
              code: 404,
              message: "no data found",
              data: {},
            })
        )
        .catch((error) => res.status(500).json({ error }));
    }
    if (typeof personContact === "string") {
      return this.fromPerson("contact", personContact)
        .then((operation) =>
          operation
            ? successResponse({ res, data: [...operation] })
            : errorResponse({
              res,
              code: 404,
              message: "no data found",
              data: {},
            })
        )
        .catch((error) => res.status(500).json({ error }));
    }
    if (typeof personEmail === "string") {
      return this.fromPerson("email", personEmail)
        .then((operation) =>
          operation
            ? successResponse({ res, data: [...operation] })
            : errorResponse({
              res,
              code: 404,
              message: "no data found",
              data: {},
            })
        )
        .catch((error) => res.status(500).json({ error }));
    }
    if (typeof personNationalId === "string") {
      return this.fromPerson("nationalId", personNationalId)
        .then((operation) =>
          operation
            ? successResponse({ res, data: [...operation] })
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
    const body: IOperation = req.body;
    return this.update(req.body._id, body)
      .then((operation) => successResponse({ res, data: operation }))
      .catch((error) => errorResponse({ res, data: error }));
  };

}

const operationController = new OperationController();
export default operationController;
