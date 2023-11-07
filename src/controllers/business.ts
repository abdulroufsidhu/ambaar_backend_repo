import { NextFunction, Request, Response } from "express";
import { Business, IBusiness } from "../models";
import { branchController, permissionController } from ".";
import { errorResponse, successResponse } from "../libraries/unified_response";
import { Logger } from "../libraries/logger";

const create = (business: IBusiness, location: string, userId: string) => {
  const b = new Business({ ...business });
  return b.save().then((business) =>
    permissionController.readAll().then((perms) => {
      Logger.i("business permissions count", perms.length);
      return branchController
        .create(
          userId,
          {
            name: "Main",
            contact: business.contact,
            business: business._id,
            email: business.email,
            location: location,
          },
          perms.map(i=>i._id)
        )
        .then((res) => res);
    })
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
    .then((employee) => successResponse({ res, data: employee }))
    .catch((error) => errorResponse({ res, data: error }));
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
          ? successResponse({ res, data: business })
          : errorResponse({
              res,
              code: 404,
              message: "Business Not Found",
              data: {},
            })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  if (typeof email == "string") {
    return fromEmail(email)
      .then((business) =>
        business
          ? successResponse({ res, data: business })
          : errorResponse({
              res,
              code: 404,
              message: "Business Not Found",
              data: {},
            })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  if (typeof contact == "string") {
    return fromContact(contact)
      .then((business) =>
        business
          ? successResponse({ res, data: business })
          : errorResponse({
              res,
              code: 404,
              message: "Business Not Found",
              data: {},
            })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  if (typeof licence == "string") {
    return fromLicence(licence)
      .then((business) =>
        business
          ? successResponse({ res, data: business })
          : errorResponse({
              res,
              code: 404,
              message: "Business Not Found",
              data: {},
            })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  if (typeof name == "string") {
    return fromName(name)
      .then((business) =>
        business
          ? successResponse({ res, data: business })
          : errorResponse({
              res,
              code: 404,
              message: "Business Not Found",
              data: {},
            })
      )
      .catch((error) => errorResponse({ res, data: error }));
  }

  // return all()
  //   .then((business) =>
  //     business
  //       ? successResponse({ res, data: [...business] })
  //       : errorResponse({ res, code: 404, message: "Business Not Found", data: {} })
  //   )
  //   .catch((error) => errorResponse({ res, data: error }));

  return errorResponse({
    res,
    message:
      "Please make sure to provide id, contact, licence or email query parameter",
    data: {},
  });
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IBusiness = req.body;
  return Business.findByIdAndUpdate(req.body._id, body)
    .then((business) => res.status(204).json({ business }))
    .catch((error) => errorResponse({ res, data: error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return remove(id)
      .then((business) =>
        business
          ? successResponse({ res, data: business })
          : errorResponse({ res, message: "Business Not Removed", data: {} })
      )
      .catch((error) => errorResponse({ res, data: error }));
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
