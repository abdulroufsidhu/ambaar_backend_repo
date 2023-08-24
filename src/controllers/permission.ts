import { NextFunction, Request, Response } from "express";
import { Permission, IPermission } from "../models";
import { errorResponse, successResponse } from "../libraries/unified_response";

const create = async (permission: IPermission) => {
  const p = new Permission({ ...permission });
  return p.save().then((permission) => permission);
};

const fromId = async (id: string) => Permission.findById(id).then((p) => p);
const remove = async (id: string) =>
  Permission.findByIdAndDelete(id).then((p) => p);
const fromName = async (name: string) =>
  Permission.findOne({ name: name }).then((p) => p);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IPermission = req.body;
  return create(body)
    .then((permission) => res.status(201).json({ permission }))
    .catch((error) => res.status(500).json({ error }));
};

const readAll = async () => 
  Permission.find().then((perm)=>perm)


const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return fromId(id)
      .then((permission) =>
        permission
          ? successResponse({ res, data: permission })
          : errorResponse({ res, code: 404, message: "permission not found", data: {} })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  // if (typeof name == "string") {
  //   return fromName(name)
  //     .then((permission) => successResponse({ res, data: permission }))
  //     .catch((error) => errorResponse({ res, data: error }));
  // }
  return errorResponse({ res, message: "id is missing", data: {} });
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IPermission = req.body;
  return Permission.findByIdAndUpdate(req.body._id, body)
    .then((permission) => successResponse({ res, data: permission }))
    .catch((error) => errorResponse({ res, data: error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return remove(id)
      .then((permission) =>
        permission
          ? successResponse({ res, data: permission })
          : errorResponse({ res, message: "permission not removed", data: {} })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  return errorResponse({ res, message: "id is missing", data: {} });
};

export default {
  create,
  fromId,
  fromName,
  remove,
  // TODO update,
  createReq,
  readAll,
  readReq,
  updateReq,
  removeReq,
};
