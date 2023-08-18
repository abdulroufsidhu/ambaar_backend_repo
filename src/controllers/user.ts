import { NextFunction, Request, Response } from "express";
import personController from "./person";
import { User, IUser } from "../models";
import { Logger } from "../libraries/logger";

const create = async (user: IUser) => {
  if (!!!user.person) return;
  if (!!!user.password) return;
  return personController.create(user.person).then((person) => fromPerson(person._id)
    .then((user) => user)
    .catch(() => {
      return new User({ person, password: user.password })
        .save()
        .then((user) => {
          return user;
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
      ?.then((user) => res.status(201).json({ _id: user?._id, person: user?.person }))
      ?.catch((error) => res.status(500).json({ error })) ??
    res.status(500).json({ error: "User not created" })
  );
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.query.email;
  const password = req.query.password;

  if (
    !!!email ||
    !!!password ||
    typeof email != "string" ||
    typeof password != "string"
  ) {
    return res.status(500).json({ error: "email or password is missing" });
  }
  return fromEmail(email, password)
    .then((user) =>
      user
        ? res.status(200).json({ _id: user._id, person: user.person })
        : res.status(404).json({ message: "User Not Found" })
    )
    .catch((error) => res.status(500).json({ error }));
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IUser = req.body;
  return User.findByIdAndUpdate(req.body._id, body)
    .then((user) => res.status(204).json({ user }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return remove(id)
      .then((user) => (user ? res.status(200).json({ user }) : { error: "User Not Removed" }))
      .catch((error) => res.status(500).json({ error }));
  }
  return res
    .status(500)
    .json({ error: "Please make sure to provide id query parameter" });
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
