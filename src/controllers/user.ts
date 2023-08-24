import { NextFunction, Request, Response } from "express";
import personController from "./person";
import { User, IUser } from "../models";
import { Logger } from "../libraries/logger";
import { errorResponse, successResponse } from "../libraries/unified_response";

const create = async (user: IUser) => {
  if (!!!user.person) return;
  if (!!!user.password) return;
  return personController.create(user.person).then((person) => fromPerson(person._id)
    .then((user) => user)
    .catch(() => {
      return new User({ person, password: user.password })
        .save()
        .then((user) => {
          return fromId(user._id);
        });
    })

  );
};

const fromPerson = async (person_id: string) =>
  User.findOne({ person: person_id })
    .select("-password").then((user) => { if (!!user) return user; throw new Error("User not found") });
const fromEmail = async (email: string, password: string) =>
  personController.fromEmail(email).then((p) =>
    !!!p
      ? undefined
      : User.findOne({ person: p._id, password: password })
        .populate("person")
        .select("-password")
        .exec()
        .then((user) => user)
  );

const fromId = async (id: string) => User.findById(id)
  .select("-password").then((user) => user);

const remove = async (id: string) =>
  User.findByIdAndDelete(id).then((user) => user);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IUser = {
    password: req.body.password,
    person: req.body.person,
  };
  Logger.w("User", req.body);
  return (
    create(body)
      ?.then((user) => successResponse({ res, data: user }))
      ?.catch((error) => errorResponse({ res, data: error })) ??
    res.status(500).json({ error: "User not created" })
  );
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.query.email;
  const password = req.query.password;

  if (
    !!!email ||
    typeof email != "string"
  ) {
    return errorResponse({ res, message: "email or passord is missing", data: {} });
  }

  if (
    !!!password ||
    typeof password != "string"
  ) {
    return errorResponse({ res, message: "password or passord is missing", data: {} });
  }
  return fromEmail(email, password)
    .then((user) =>
      user
        ? successResponse({ res, data: user })
        : errorResponse({ res, code: 404, message: "User not found", data: {} })
    )
    .catch((error) => errorResponse({ res, data: error }));
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IUser = req.body;
  return User.findByIdAndUpdate(req.body._id, body)
    .then((user) => successResponse({ res, code: 204, data: user }))
    .catch((error) => errorResponse({ res, data: error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return remove(id)
      .then((user) => (user ? successResponse({ res, data: user }) : { error: "User Not Removed" }))
      .catch((error) => errorResponse({ res, data: error }));
  }
  return errorResponse({ res, message: "Please make sure to provide id query parameter", data: {} })
};

export default {
  create,
  fromPerson,
  fromEmail,
  fromId,
  remove,
  // TODO update,
  createReq,
  readReq,
  updateReq,
  removeReq,
};
