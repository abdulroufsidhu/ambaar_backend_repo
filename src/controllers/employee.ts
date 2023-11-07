import { NextFunction, Request, Response } from "express";
import { Employee, IEmployee } from "../models";
import { errorResponse, successResponse } from "../libraries/unified_response";

const create = async (employee: IEmployee) => {
  const e = new Employee({ ...employee });
  return e.save().then((employee) => employee);
};

const update = async (id: string, employee: IEmployee) =>
  Employee.findByIdAndUpdate(id, employee);

const fromId = async (id: string) =>
  Employee.findById(id)
    .populate([
      {
        path: "permissions",
        model: "Permission",
      },
      {
        path: "user",
        select: "-password -token",
        populate: {
          path: "person",
          model: "Person",
        },
      },
      {
        path: "branch",
        populate: {
          path: "business",
          model: "Business",
        },
      },
    ])
    .then((e) => e);
const fromUserId = async (id: string) =>
  Employee.find({ user: id, status: "active" })
    .populate([
      {
        path: "permissions",
        model: "Permission",
      },
      {
        path: "user",
        select: "-password -token",
        populate: {
          path: "person",
          model: "Person",
        },
      },
      {
        path: "branch",
        populate: {
          path: "business",
          model: "Business",
        },
      },
    ])
    .then((e) => e);
const fromBranchId = async (id: string) =>
  Employee.find({ branch: id, status: "active" })
    .populate([
      {
        path: "permissions",
        model: "Permission"
      },
      {
        path: "user",
        select: "-password -token",
        populate: {
          path: "person",
          model: "Person",
        },
      },
      {
        path: "branch",
        populate: {
          path: "business",
          model: "Business",
        },
      },
    ])
    .then((e) => e);

const remove = async (id: string) =>
  Employee.findByIdAndUpdate(id, { status: "inactive" }).then((e) => e);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IEmployee = req.body;
  return create(body)
    .then((employee) => successResponse({ res, data: employee }))
    .catch((error) => errorResponse({ res, data: error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const uid = req.query.uid;
  const branchId = req.query.branch_id;
  if (typeof id == "string") {
    return fromId(id)
      .then((employee) =>
        employee
          ? successResponse({ res, data: employee })
          : errorResponse({
              res,
              code: 404,
              message: "employee not found",
              data: {},
            })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  if (typeof uid == "string") {
    return fromUserId(uid)
      .then((employee) =>
        employee
          ? successResponse({ res, data: [...employee] })
          : errorResponse({
              res,
              code: 404,
              message: "employee not found",
              data: {},
            })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  if (typeof branchId == "string") {
    return fromBranchId(branchId)
      .then((employee) =>
        employee
          ? successResponse({ res, data: [...employee] })
          : errorResponse({
              res,
              code: 404,
              message: "employee not found",
              data: {},
            })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  return errorResponse({
    res,
    message: "Please make sure to provide id, uid or branch_id query parameter",
    data: {},
  });
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IEmployee = req.body;
  return Employee.findByIdAndUpdate(req.body._id, body)
    .then((employee) => successResponse({ res, data: employee }))
    .catch((error) => errorResponse({ res, data: error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  return remove(id)
    .then((employee) =>
      employee
        ? successResponse({ res, data: employee })
        : errorResponse({ res, message: "employee not removed", data: {} })
    )
    .catch((error) => errorResponse({ res, data: error }));
};

export default {
  create,
  fromId,
  remove,
  // TODO update,
  createReq,
  readReq,
  update,
  updateReq,
  removeReq,
};
