import { Request, Response, NextFunction } from "express";
import { IOperation, IPerson, Operation } from "../models";
import { inventoryController } from ".";
import { Logger } from "../libraries/logger";
import { errorResponse, successResponse } from "../libraries/unified_response";
import { personController } from ".";

const create = async (operation: IOperation) => {
  return personController.create(operation.person).then((person) =>
    Operation.create({ ...operation, person: person._id }).then((res) => {
      const increament =
        operation.action === "sale" ? -operation.quantity : operation.quantity;
      Logger.i("operation remainingQuantity", increament);
      return inventoryController
        .increamentQuantity(operation.inventory._id, increament)
        .then((inv) => {
          Logger.i("operation", inv);
          return res;
        });
    })
  );
};

const fromId = async (id: string) =>
  Operation.findById(id)
    .populate("inventory.branch")
    .populate("employee.user")
    .then((inv) => inv);
const fromBranch = async (branchId: string) =>
  Operation.find({
    "inventory.branch": branchId,
  })
    .populate("inventory.branch")
    .populate("employee.user")
    .exec()
    .then((operations) => [...operations]);
const fromProduct = async (branchId: string, productName: string) =>
  Operation.find({
    "inventory.branch": branchId,
    "inventory.product.name": productName,
  })
    .populate("inventory.branch")
    .populate("employee.user")
    .exec()
    .then((operations) => [...operations]);

const fromPerson = async (field: string, value: string) => {
  const fieldPath = "person." + field;
  return Operation.find({
    fieldPath: value,
  })
    .populate("inventory.branch")
    .populate("employee.user")
    .exec()
    .then((operations) => [...operations]);
};

const update = async (id: string, operation: IOperation) =>
  Operation.findByIdAndUpdate(id, operation).exec();

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IOperation = req.body;
  return create(body)
    .then((operation) => successResponse({ res, data: operation }))
    .catch((error) => errorResponse({ res, data: error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const branchId = req.query.branch_id;
  const productName = req.query.product_name;
  const personName = req.query.name;
  const personContact = req.query.contact;
  const personEmail = req.query.email;
  const personNationalId = req.query.national_id;
  if (typeof id === "string") {
    return fromId(id)
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
      return fromProduct(branchId, productName)
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
    return fromBranch(branchId)
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
    return fromPerson("name", personName)
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
    return fromPerson("contact", personContact)
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
    return fromPerson("email", personEmail)
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
    return fromPerson("nationalId", personNationalId)
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

const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IOperation = req.body;
  return update(req.body._id, body)
    .then((operation) => successResponse({ res, data: operation }))
    .catch((error) => errorResponse({ res, data: error }));
};

export default {
  create,
  update,
  fromId,
  fromPerson,
  fromProduct,
  fromBranch,
  createReq,
  readReq,
  updateReq,
};
