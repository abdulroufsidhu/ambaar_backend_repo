import { NextFunction, Request, Response } from "express";
import Branch, { IBranch } from "../models/Branch";

const create = (branch: IBranch) => {
  const b = new Branch({ ...branch });
  return b.save().then(branch => branch);
}

const fromId = (id: string) => Branch.findById(id).then((b) => b);
const remove = (id: string) => Branch.findByIdAndDelete(id).then((b) => b);
const fromEmail = (email: string) =>
  Branch.findOne({ email: email }).then((b) => b);

const createReq = (req: Request, res: Response, next: NextFunction) => {
  const body: IBranch = req.body;
  return create(body)
    .then((branch) => res.status(201).json({ branch }))
    .catch((error) => res.status(500).json({ error }));
};

const readReq = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  return fromId(id)
    .then((branch) =>
      branch
        ? res.status(201).json({ branch })
        : res.status(404).json({ message: "Branch Not Found" })
    )
    .catch((error) => res.status(500).json({ error }));
};
const updateReq = (req: Request, res: Response, next: NextFunction) => {
  const body: IBranch = req.body;
  return Branch.findByIdAndUpdate(req.body._id)
    .then((branch) => res.status(201).json({ branch }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  return remove(id)
    .then((branch) => (branch ? res.status(201).json({ branch }) : res.status(500).json({ error: "Branch Not Removed" })))
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
