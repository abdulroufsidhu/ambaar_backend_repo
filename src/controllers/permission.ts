import { NextFunction, Request, Response } from "express";
import { Permission, IPermission } from "../models";

const create = async (permission: IPermission) => {
  const p = new Permission({ ...permission });
  return p.save().then(permission => permission);
}

const fromId = async (id: string) => Permission.findById(id).then((p) => p);
const remove = async (id: string) => Permission.findByIdAndDelete(id).then((p) => p);
const fromEmail = async (email: string) =>
  Permission.findOne({ email: email }).then((p) => p);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IPermission = req.body;
  return create(body)
    .then((permission) => res.status(201).json({ permission }))
    .catch((error) => res.status(500).json({ error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return fromId(id)
      .then((permission) =>
        permission
          ? res.status(201).json({ permission })
          : res.status(404).json({ message: "Branch Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  Permission.find()
    .then(permissions => res.status(201).json({ permissions }))
    .catch(error => res.status(500).json({ error }));
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IPermission = req.body;
  return Permission.findByIdAndUpdate(req.body._id)
    .then((permission) => res.status(201).json({ permission }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return remove(id)
      .then((permission) => (permission ? res.status(201).json({ permission }) : res.status(500).json({ error: "Permission Not Removed" })))
      .catch((error) => res.status(500).json({ error }));
  }
  res.status(500).json({ error: "Please make sure to provide id query parameter" });
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
