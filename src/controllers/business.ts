import { NextFunction, Request, Response } from "express";
import { Business, IBusiness } from "../models";
import { branchController } from ".";
import { employeeController } from ".";
import employee from "./employee";

const create = (business: IBusiness, location: string, userId: string) => {
  const b = new Business({ ...business });
  return b.save().then((business) =>
    branchController
      .create(userId, {
        name: "Main",
        contact: business.contact,
        business: business._id,
        email: business.email,
        location: location,
      })
      .then((res) => res)
  );
};

const all = async () =>
  Business.find()
    .populate("founder")
    .then((b) => b);

const fromId = async (id: string) =>
  Business.findById(id)
    .populate("founder")
    .then((b) => b);
const fromName = async (name: string) =>
  Business.find({ name: name })
    .populate("founder")
    .then((b) => b);
const fromEmail = async (email: string) =>
  Business.findOne({ email: email })
    .populate("founder")
    .then((b) => b);
const fromContact = async (contact: string) =>
  Business.findOne({ contact: contact })
    .populate("founder")
    .then((b) => b);
const fromLicence = async (licence: string) =>
  Business.findOne({ licence: licence })
    .populate("founder")
    .then((b) => b);
const remove = async (id: string) =>
  Business.findByIdAndDelete(id).then((b) => b);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IBusiness = req.body;
  return create(body, req.body.location, req.body.user_id)
    .then((employee) =>
      res.status(201).json({
        _id: employee._id,
        user: employee.user,
        branch: employee.branch,
        role: employee.role,
        permissions: employee.permissions,
      })
    )
    .catch((error) => res.status(500).json({ error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const email = req.query.email;
  const contact = req.query.contact;
  const licence = req.query.licence;
  const name = req.query.name;
  if (typeof id == "string") {
    return fromId(id)
      .then((business) =>
        business
          ? res.status(200).json({ business })
          : res.status(404).json({ message: "Business Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof email == "string") {
    return fromEmail(email)
      .then((business) =>
        business
          ? res.status(200).json({ business })
          : res.status(404).json({ message: "Business Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof contact == "string") {
    return fromContact(contact)
      .then((business) =>
        business
          ? res.status(200).json({ business })
          : res.status(404).json({ message: "Business Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof licence == "string") {
    return fromLicence(licence)
      .then((business) =>
        business
          ? res.status(200).json({ business })
          : res.status(404).json({ message: "Business Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  if (typeof name == "string") {
    return fromName(name)
      .then((business) =>
        business
          ? res.status(200).json({ business })
          : res.status(404).json({ message: "Business Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }

  // return all()
  //   .then((business) =>
  //     business
  //       ? res.status(200).json([...business])
  //       : res.status(404).json({ message: "Business Not Found" })
  //   )
  //   .catch((error) => res.status(500).json({ error }));

  return res.status(500).json({
    error:
      "Please make sure to provide id, contact, licence or email query parameter",
  });
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IBusiness = req.body;
  return Business.findByIdAndUpdate(req.body._id, body)
    .populate("founder")
    .then((business) =>
      res.status(204).json({
        _id: business?._id,
        name: business?.name,
        contact: business?.contact,
        email: business?.email,
        licence: business?.licence,
        founder: business?.founder,
      })
    )
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return remove(id)
      .then((business) =>
        business
          ? res.status(200).json({ _id: business._id })
          : res.status(404).json({ error: "Business Not Removed" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  res
    .status(500)
    .json({ error: "Please make sure to provide id query parameter" });
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
