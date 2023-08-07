import { NextFunction, Request, Response } from "express";
import { Business, IBusiness } from "../models";
import { Logger } from "../libraries/logger";

const create = (business: IBusiness) => {
  const b = new Business({ ...business });
  return b.save().then(business => business);
}

const fromId = async (id: string) => Business.findById(id).populate("Person").then((b) => b);
const fromEmail = (email: string) =>
  Business.findOne({ email: email }).then((b) => b);
const fromContact = (contact: string) =>
  Business.findOne({ contact: contact }).then((b) => b);
const fromLicence = (licence: string) =>
  Business.findOne({ licence: licence }).then((b) => b);
const remove = async (id: string) => Business.findByIdAndDelete(id).then((b) => b);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IBusiness = req.body;
  return create(body)
    .then((business) => res.status(201).json({ business }))
    .catch((error) => res.status(500).json({ error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const email = req.query.email;
  const contact = req.query.contact;
  const licence = req.query.licence;
  if (typeof id == "string") {
    return fromId(id)
      .then((business) =>
        business
          ? res.status(201).json({ business })
          : res.status(404).json({ message: "Business Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof email == "string") {
    return fromEmail(email)
      .then((business) =>
        business
          ? res.status(201).json({ business })
          : res.status(404).json({ message: "Business Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof contact == "string") {
    return fromContact(contact)
      .then((business) =>
        business
          ? res.status(201).json({ business })
          : res.status(404).json({ message: "Business Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof licence == "string") {
    return fromLicence(licence)
      .then((business) =>
        business
          ? res.status(201).json({ business })
          : res.status(404).json({ message: "Business Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  return res.status(500).json(
    { error: "Please make sure to provide id, contact, licence or email query parameter" }
  );

};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IBusiness = req.body;
  return Business.findByIdAndUpdate(req.body._id)
    .then((business) => res.status(201).json({ business }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return remove(id)
      .then((business) => (business ? res.status(201).json({ business }) : res.status(500).json({ error: "Business Not Removed" })))
      .catch((error) => res.status(500).json({ error }));
  }
  res.status(500).json({ error: "Please make sure to provide id query parameter" })
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
