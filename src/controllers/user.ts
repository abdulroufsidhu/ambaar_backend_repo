import { NextFunction, Request, Response } from "express";
import personController from "./person";
import { User, IUser } from "../models";
import { Logger } from "../libraries/logger";
import { errorResponse, successResponse } from "../libraries/unified_response";
import { config } from "../config/config";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";

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

const fromPerson = async (person_id: string) =>
  User.findOne({ person: person_id }).then((user) => {
    if (!!user) return user;
    throw new Error("User not found");
  });
const fromEmail = async (email: string, password: string) =>
  personController.fromEmail(email).then((p) =>
    !!!p
      ? undefined
      : User.findOne({ person: p._id })
          .select("+password")
          .then((user) =>
            user
              ?.comparePassword(password)
              .then((match) =>
                match ? user.populate("person").then((user) => user) : null
              )
          )
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
      ?.then((user) => {
        if (!user) {
          errorResponse({res, message: "User created successfully"})
        }
        const token = jwt.sign(
          { _id: user!._id, person: user!.person },
          config.JWT.key
        ); // Replace 'your-secret-key' with your actual secret key
        user!.token = token; // Update the user with the token (you might save this in a database in real scenarios)
        return user?.save().then(v=>successResponse({res, data: v})).catch(e=>errorResponse({res, data: e}))
      })
      ?.catch((error) => errorResponse({ res, data: error })) ?? errorResponse({res, code: 500, message: "User not created"})
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
        return user.save().then(() =>
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

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ _id: req.body.user._id }).select(
      "+password"
    );
    const oldPassword: string = req.body.old_password?.toString() ?? "";
    const newPassword: string = req.body.new_password?.toString() ?? "";
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the old password matches the current password
    const userModel = new UserModel(user);
    const isPasswordMatch = await userModel.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      throw new Error("Old password is incorrect");
    }

    // Update the password
    user.password = newPassword;
    return user.save().then((user) => successResponse({ res, data: user }));
  } catch (error) {
    return errorResponse({ res, data: error });
  }
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
  changePassword,
};
