import { NextFunction, Request, Response } from "express";
import { Employee, IEmployee } from "../models";
import { errorResponse, successResponse } from "../libraries/unified_response";

class EmployeeController {
  create = async (employee: IEmployee) => {
    const e = new Employee({ ...employee });
    return e.save().then((employee) => employee);
  };

  update = async (id: string, employee: IEmployee) =>
    Employee.findByIdAndUpdate(id, employee);

  fromId = async (id: string) =>
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
  fromUserId = async (id: string) =>
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
  fromBranchId = async (id: string) =>
    Employee.find({ branch: id, status: "active" })
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

  remove = async (id: string) =>
    Employee.findByIdAndUpdate(id, { status: "inactive" }).then((e) => e);

  createReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IEmployee = req.body;
    return this.create(body)
      .then((employee) => successResponse({ res, data: employee }))
      .catch((error) => errorResponse({ res, data: error }));
  };

  readReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    const uid = req.query.uid;
    const branchId = req.query.branch_id;
    if (typeof id == "string") {
      return this.fromId(id)
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
      return this.fromUserId(uid)
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
      return this.fromBranchId(branchId)
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
  updateReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IEmployee = req.body;
    return this.update(req.body._id, body)
      .then(emp => emp?.populate([
        { path: "user", populate: { path: "person" } },
        { path: "branch", populate: { path: "business" } },
        { path: "permissions" },
      ])
        .then((employee) => successResponse({ res, data: employee }))
        .catch((error) => errorResponse({ res, data: error })))
      .catch((error) => errorResponse({ res, data: error }));
  };
  removeReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    return this.remove(id)
      .then((employee) =>
        employee
          ? successResponse({ res, data: employee })
          : errorResponse({ res, message: "employee not removed", data: {} })
      )
      .catch((error) => errorResponse({ res, data: error }));
  };
}

const employeeController = new EmployeeController()
export default employeeController;


