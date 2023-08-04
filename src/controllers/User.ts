import { NextFunction, Request, Response } from "express";
import personController from "./Person";
import User, { IUser } from "../models/User";
import { Logger } from "../libraries/Logger";

const create = (user: IUser) => {
  if (!!!user.person) return;
  if (!!!user.password) return;
  return personController
    .create(user.person)
    .then((person) =>
      new User({ person, password: user.password }).save().then((user) => user)
    );
};

const fromEmail = (email: string) =>
  personController.fromEmail(email).then((p) =>
    !!!p
      ? undefined
      : User.findOne({ person: p._id })
          .populate("person")
          .exec()
          .then((user) => user)
  );

const fromId = (id: string) => User.findById(id).then((user) => user);

const remove = (id: string) => User.findByIdAndDelete(id).then((user) => user);

const createReq = (req: Request, res: Response, next: NextFunction) => {
  const body: IUser = {
    password: req.body.password,
    person: req.body.person,
  };
  Logger.w("User", body);
  return (
    create(body)
      ?.then((user) => res.status(201).json({ user }))
      ?.catch((error) => res.status(500).json({ error })) ??
    res.status(500).json({ error: "User not created" })
  );
};

const readReq = (req: Request, res: Response, next: NextFunction) => {
  const email = req.params.email;
  return fromEmail(email)
    .then((user) =>
      user
        ? res.status(201).json({ user })
        : res.status(404).json({ message: "User Not Found" })
    )
    .catch((error) => res.status(500).json({ error }));
};
const updateReq = (req: Request, res: Response, next: NextFunction) => {
  const body: IUser = req.body;
  return User.findByIdAndUpdate(req.body._id, body)
    .then((user) => res.status(201).json({ user }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.uid;
  return remove(id)
    .then((user) => (user ? user : { error: "User Not Removed" }))
    .catch((error) => res.status(500).json({ error }));
};

export default {
  create,
  fromEmail,
  fromId,
  remove,
  // TODO update,
  createReq,
  readReq,
  updateReq,
  removeReq,
};
