import { NextFunction, Request, Response } from "express";
import { Permission, IPermission } from "../models";
import { errorResponse, successResponse } from "../libraries/unified_response";

class PermissionController {
  create = async (permission: IPermission) => {
    const p = new Permission({ ...permission });
    return p.save().then((permission) => permission);
  };

  fromId = async (id: string) => Permission.findById(id).then((p) => p);
  remove = async (id: string) =>
    Permission.findByIdAndDelete(id).then((p) => p);
  fromName = async (name: string) =>
    Permission.findOne({ name: name }).then((p) => p);

  createReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IPermission = req.body;
    return this.create(body)
      .then((permission) => res.status(201).json({ permission }))
      .catch((error) => res.status(500).json({ error }));
  };

  readAll = async () =>
    Permission.find().then((perm) => perm)


  readReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    if (typeof id == "string") {
      return this.fromId(id)
        .then((permission) =>
          permission
            ? successResponse({ res, data: permission })
            : errorResponse({ res, code: 404, message: "permission not found", data: {} })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    return this.readAll().then(permissions => successResponse({ res, data: permissions }))
  };
  updateReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IPermission = req.body;
    return Permission.findByIdAndUpdate(req.body._id, body)
      .then((permission) => successResponse({ res, data: permission }))
      .catch((error) => errorResponse({ res, data: error }));
  };
  removeReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    if (typeof id == "string") {
      return this.remove(id)
        .then((permission) =>
          permission
            ? successResponse({ res, data: permission })
            : errorResponse({ res, message: "permission not removed", data: {} })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    return errorResponse({ res, message: "id is missing", data: {} });
  };
}

const permissionController = new PermissionController();
export default permissionController;

