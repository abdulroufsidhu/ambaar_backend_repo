import { NextFunction, Request, Response } from "express";
import personController from "./person";
import { User, IUser } from "../models";
import { Logger } from "../libraries/logger";
import { errorResponse, successResponse } from "../libraries/unified_response";
import { config } from "../config/config";
import jwt from "jsonwebtoken";

const create = async (user: IUser) => {
  if (!!!user.person) return;
  if (!!!user.password) return;
  return personController.create(user.person).then((person) =>
    fromPerson(person._id)
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

const update = async (id: string, user: IUser) =>
  User.findByIdAndUpdate(id, user);

const fromPerson = async (person_id: string) =>
  User.findOne({ person: person_id }).then((user) => {
    if (!!user) return user;
    throw new Error("User not found");
  });
const fromEmail = async (email: string, password: string) =>
  personController.fromEmail(email).then((p) =>
    !!!p
      ? undefined
      : User.findOne({ person: p._id, password: password })
          .populate("person")

          .exec()
          .then((user) => user)
  );

const fromId = async (id: string) => User.findById(id).then((user) => user);

const remove = async (id: string) =>
  User.findByIdAndDelete(id).then((user) => user);

const fromToken = async (token: string) =>
  User.findOne({ token: token }).then((user) => user);

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
  const id = req.query.id;
  if (typeof id === "string") {
    return fromId(id)
      .then((user) => successResponse({ res, data: user }))
      .catch((error) => errorResponse(error));
  }

  if (!!!email || typeof email != "string") {
    return errorResponse({
      res,
      message: "email or passord is missing",
      data: {},
    });
  }

  if (!!!password || typeof password != "string") {
    return errorResponse({
      res,
      message: "password or passord is missing",
      data: {},
    });
  }
  return fromEmail(email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          { _id: user._id, person: user.person },
          config.JWT.key
        ); // Replace 'your-secret-key' with your actual secret key
        user.token = token; // Update the user with the token (you might save this in a database in real scenarios)
        return update(user._id, user).then(() =>
          successResponse({ res, data: user })
        );
      } else {
        errorResponse({
          res,
          code: 404,
          message: "User not found",
          data: {},
        });
      }
    })
    .catch((error) => {
      Logger.w("user", error);
      return errorResponse({ res, data: error });
    });
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
      .then((user) =>
        user
          ? successResponse({ res, data: user })
          : { error: "User Not Removed" }
      )
      .catch((error) => errorResponse({ res, data: error }));
  }
  return errorResponse({
    res,
    message: "Please make sure to provide id query parameter",
    data: {},
  });
};

export default {
  create,
  update,
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
