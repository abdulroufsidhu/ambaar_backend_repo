import { NextFunction, Request, Response } from "express";
import { Branch, IBranch } from "../models";

const create = async (branch: IBranch) => {
  const b = new Branch({ ...branch });
  return b.save().then((branch) => branch);
};

const fromId = async (id: string) =>
  Branch.findById(id)
    .populate("business")
    .then((b) => b);
const fromBusinessId = async (id: string) =>
  Branch.find({ business: id })
    .populate("business")
    .then((b) => b);
const fromEmail = async (email: string) =>
  Branch.findOne({ email: email })
    .populate("business")
    .then((b) => b);
const fromContact = async (contact: string) =>
  Branch.findOne({ contact: contact })
    .populate("business")
    .then((b) => b);
const remove = async (id: string) =>
  Branch.findByIdAndDelete(id).then((b) => b);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IBranch = req.body;
  return create(body)
    .then((branch) => res.status(201).json({ branch }))
    .catch((error) => res.status(500).json({ error }));
};

// const readFromBusinessId = async (req: Request, res: Response, next: NextFunction) => fromBusinessId(req.query.business_id)
const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const business_id = req.query.business_id;
  const email = req.query.email;
  const contact = req.query.contact;
  if (typeof id == "string") {
    return fromId(id)
      .then((branch) =>
        branch
          ? res.status(200).json({ branch })
          : res.status(404).json({ message: "Branch Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof business_id == "string") {
    return fromBusinessId(business_id)
      .then((branch) =>
        branch
          ? res.status(200).json([...branch])
          : res.status(404).json({ message: "Branch Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof email == "string") {
    return fromEmail(email)
      .then((branch) =>
        branch
          ? res.status(200).json({ branch })
          : res.status(404).json({ message: "Branch Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof contact == "string") {
    return fromContact(contact)
      .then((branch) =>
        branch
          ? res.status(200).json({ branch })
          : res.status(404).json({ message: "Branch Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  return res.status(500).json({
    error:
      "Please make sure to provide id, contact, business_id or email query parameter",
  });
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IBranch = req.body;
  return Branch.findByIdAndUpdate(req.body._id, body)
    .then((branch) => res.status(204).json({ branch }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  return remove(id)
    .then((branch) =>
      branch
        ? res.status(200).json({ branch })
        : res.status(500).json({ error: "Branch Not Removed" })
    )
    .catch((error) => res.status(500).json({ error }));
};

export default {
  create,
  fromId,
  fromEmail,
  fromContact,
  remove,
  // TODO update,
  createReq,
  readReq,
  updateReq,
  removeReq,
};
