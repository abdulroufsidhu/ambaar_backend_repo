import { NextFunction, Request, Response } from "express";
import { Employee, IEmployee } from "../models";

const create = async (employee: IEmployee) => {
  const e = new Employee({ ...employee });
  return e.save().then((employee) => employee);
};

const fromId = async (id: string) =>
  Employee.findById(id)
    .populate(["user", "branch", "permissions"])
    .populate({
      path: "user",
      select: "-password",
      populate: {
        path: "person",
        model: "Person",
      },
    })
    .populate({
      path: "branch",
      populate: {
        path: "business",
        model: "Business",
      },
    })
    .then((e) => e);
const fromUserId = async (id: string) =>
  Employee.find({ user: id })
    .populate(["user", "branch", "permissions"])
    .populate({
      path: "user",
      select: "-password",
      populate: {
        path: "person",
        model: "Person",
      },
    })
    .populate({
      path: "branch",
      populate: {
        path: "business",
        model: "Business",
      },
    })
    .then((e) => e);
const fromBranchId = async (id: string) =>
  Employee.find({ branch: id })
    .populate(["user", "branch", "permissions"])
    .populate({
      path: "user",
      select: "-password",
      populate: {
        path: "person",
        model: "Person",
      },
    })
    .populate({
      path: "branch",
      populate: {
        path: "business",
        model: "Business",
      },
    })
    .then((e) => e);

const remove = async (id: string) =>
  Employee.findByIdAndDelete(id).then((e) => e);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IEmployee = req.body;
  return create(body)
    .then((employee) => res.status(201).json({ employee }))
    .catch((error) => res.status(500).json({ error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const uid = req.query.uid;
  const branchId = req.query.branch_id;
  if (typeof id == "string") {
    return fromId(id)
      .then((employee) =>
        employee
          ? res.status(200).json({ employee })
          : res.status(404).json({ message: "Employee Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof uid == "string") {
    return fromUserId(uid)
      .then((employee) =>
        employee
          ? res.status(200).json([...employee])
          : res.status(404).json({ message: "Employee Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof branchId == "string") {
    return fromBranchId(branchId)
      .then((employee) =>
        employee
          ? res.status(200).json([...employee])
          : res.status(404).json({ message: "Employee Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  return res.status(500).json({
    error: "Please make sure to provide id, uid or branch_id query parameter",
  });
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IEmployee = req.body;
  return Employee.findByIdAndUpdate(req.body._id, body)
    .then((employee) => res.status(204).json({ employee }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  return remove(id)
    .then((employee) =>
      employee
        ? res.status(200).json({ employee })
        : res.status(500).json({ error: "Employee Not Removed" })
    )
    .catch((error) => res.status(500).json({ error }));
};

export default {
  create,
  fromId,
  remove,
  // TODO update,
  createReq,
  readReq,
  updateReq,
  removeReq,
};
