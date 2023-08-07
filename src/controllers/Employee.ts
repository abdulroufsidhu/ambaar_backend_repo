import { NextFunction, Request, Response } from "express";
import Employee, { IEmployee } from "../models/Employee";

const create = async (employee: IEmployee) => {
  const e = new Employee({ ...employee });
  return e.save().then(employee => employee);
}

const fromId = async (id: string) => Employee.findById(id).populate(["User", "Branch", "Permission"]).then((e) => e);
const remove = async (id: string) => Employee.findByIdAndDelete(id).then((e) => e);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IEmployee = req.body;
  return create(body)
    .then((employee) => res.status(201).json({ employee }))
    .catch((error) => res.status(500).json({ error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  return fromId(id)
    .then((employee) =>
      employee
        ? res.status(201).json({ employee })
        : res.status(404).json({ message: "Employee Not Found" })
    )
    .catch((error) => res.status(500).json({ error }));
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IEmployee = req.body;
  return Employee.findByIdAndUpdate(req.body._id)
    .then((employee) => res.status(201).json({ employee }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  return remove(id)
    .then((employee) => (employee ? res.status(201).json({ employee }) : res.status(500).json({ error: "Employee Not Removed" })))
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
