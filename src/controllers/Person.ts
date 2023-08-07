import { NextFunction, Request, Response } from "express";
import Person, { IPerson } from "../models/Person";

const create = async (person: IPerson) => {
  const p = new Person({
    ...person,
  });
  const findFilter: Array<any> = [
    {
      contact: p.contact.toString().replace(RegExp(/^\s|\n$/g), ""),
    },
  ];
  if (p.nationalId) {
    findFilter.push({ nationalId: (p.nationalId || "").trim() });
  }
  if (p.email) {
    findFilter.push({
      email: (p.email || "").trim(),
    });
  }
  return Person.findOne({
    $or: findFilter,
  }).then((person) => {
    if (person) {
      return person;
    } else {
      return p.save().then((person) => person);
    }
  });
};

const fromId = async (id: string) => Person.findById(id).then((p) => p);
const remove = async (id: string) => Person.findByIdAndDelete(id).then((p) => p);
const fromEmail = async (email: string) =>
  Person.findOne({ email: email }).then((p) => p);

const createReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IPerson = req.body;
  return create(body)
    .then((person) => res.status(201).json({ person }))
    .catch((error) => res.status(500).json({ error }));
};

const readReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return fromId(id)
      .then((person) =>
        person
          ? res.status(201).json({ person })
          : res.status(404).json({ message: "Person Not Found" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  return res.status(500).json({ error: "Please make sure to provide id query parameter" });
};
const updateReq = async (req: Request, res: Response, next: NextFunction) => {
  const body: IPerson = req.body;
  return Person.findByIdAndUpdate(req.body._id)
    .then((person) => res.status(201).json({ person }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  if (typeof id == "string") {
    return remove(id)
      .then((p) => (p ? p : { error: "Person Not Removed" }))
      .catch((error) => res.status(500).json({ error }));
  }
  return res.status(500).json({ error: "Please make sure to provide id query parameter" });
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
