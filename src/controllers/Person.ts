import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Person, { IPerson } from "../models/Person";

const create = (person: IPerson) => {
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

const read = (id: string) => Person.findById(id).then((p) => p);
const remove = (id: string) => Person.findByIdAndDelete(id).then((p) => p);

const createReq = (req: Request, res: Response, next: NextFunction) => {
  const body: IPerson = req.body;
  return create(body)
    .then((person) => res.status(201).json({ person }))
    .catch((error) => res.status(500).json({ error }));
};

const readReq = (req: Request, res: Response, next: NextFunction) => {
  const personId = req.params.personId;
  return read(personId)
    .then((person) =>
      person
        ? res.status(201).json({ person })
        : res.status(404).json({ message: "Person Not Found" })
    )
    .catch((error) => res.status(500).json({ error }));
};
const updateReq = (req: Request, res: Response, next: NextFunction) => {
  const body: IPerson = req.body;
  return Person.findByIdAndUpdate(req.body._id)
    .then((person) => res.status(201).json({ person }))
    .catch((error) => res.status(500).json({ error }));
};
const removeReq = (req: Request, res: Response, next: NextFunction) => {
  const personId = req.params.personId;
  return remove(personId)
    .then((p) => (p ? p : { error: "Person Not Removed" }))
    .catch((error) => res.status(500).json({ error }));
};

export default {
  create,
  read,
  remove,
  // TODO update,
  createReq,
  readReq,
  updateReq,
  removeReq,
};
