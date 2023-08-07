import { NextFunction, Request, Response } from "express";
import Permission, { IPermission } from "../models/Permission";

const create = (permission: IPermission) => {
  const p = new Permission({ ...permission });
  return p.save().then(permission => permission);
}

const fromId = (id: string) => Permission.findById(id).then((p) => p);
const remove = (id: string) => Permission.findByIdAndDelete(id).then((p) => p);
const fromEmail = (email: string) =>
  Permission.findOne({ email: email }).then((p) => p);

const createReq = (req: Request, res: Response, next: NextFunction) => {
  const body: IPermission = req.body;
  return create(body)
    .then((permission) => res.status(201).json({ permission }))
    .catch((error) => res.status(500).json({ error }));
};

const readReq = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  return fromId(id)
    .then((permission) =>
      permission
        ? res.status(201).json({ permission })
        : res.status(404).json({ message: "Branch Not Found" })
    )
    .catch((error) => res.status(500).json({ error }));
};
const updateReq = (req: Request, res: Response, next: NextFunction) => {
  const body: IPermission = req.body;
  return Permission.findByIdAndUpdate(req.body._id)
    .then((permission) => res.status(201).json({ permission }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  return remove(id)
    .then((permission) => (permission ? res.status(201).json({ permission }) : res.status(500).json({ error: "Permission Not Removed" })))
    .catch((error) => res.status(500).json({ error }));
};

export default {
  create,
  fromId,
  fromEmail,
  remove,
  // TODO update,
  createReq,
  readReq,
  updateReq,
  removeReq,
};
