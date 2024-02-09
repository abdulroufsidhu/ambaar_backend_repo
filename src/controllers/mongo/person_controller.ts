import { NextFunction, Request, Response } from "express";
import { Person, IPerson } from "../../models/mongo";
import { errorResponse, successResponse } from "../../libraries/unified_response";


class PersonController {
  create = async (person: IPerson) => {
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

  fromId = async (id: string) => Person.findById(id).then((p) => p);
  fromContact = async (contact: string) =>
    Person.findOne({ contact: contact }).then((p) => p);
  fromNationalId = async (nationalId: string) =>
    Person.findOne({ nationalId: nationalId }).then((p) => p);
  fromEmail = async (email: string) =>
    Person.findOne({ email: email }).then((p) => p);
  remove = async (id: string) =>
    Person.findByIdAndDelete(id).then((p) => p);

  createReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IPerson = req.body;
    return this.create(body)
      .then((person) => successResponse({ res, data: person }))
      .catch((error) => errorResponse({ res, data: error }));
  };

  readReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    const contact = req.query.contact;
    const nationalId = req.query.national_id;
    const email = req.query.email;
    if (typeof id == "string") {
      return this.fromId(id)
        .then((person) =>
          person
            ? successResponse({ res, data: person })
            : errorResponse({ res, code: 404, message: "person not found", data: {} })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    if (typeof contact == "string") {
      return this.fromContact(contact)
        .then((person) =>
          person
            ? successResponse({ res, data: person })
            : errorResponse({ res, code: 404, message: "person not found", data: {} })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    if (typeof nationalId == "string") {
      return this.fromNationalId(nationalId)
        .then((person) =>
          person
            ? successResponse({ res, data: person })
            : errorResponse({ res, code: 404, message: "person not found", data: {} })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    if (typeof email == "string") {
      return this.fromEmail(email)
        .then((person) =>
          person
            ? successResponse({ res, data: person })
            : errorResponse({ res, code: 404, message: "person not found", data: {} })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    return res
      .status(500)
      .json({
        error:
          "Please make sure to provide id, contact, nationalId or email query parameter",
      });
  };
  updateReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IPerson = req.body;
    return Person.findByIdAndUpdate(req.body._id, body)
      .then((person) => res.status(204).json({ person }))
      .catch((error) => res.status(500).json({ error }));
  };
  removeReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    if (typeof id == "string") {
      return this.remove(id)
        .then((p) => (p ? res.status(200).json({ person: p }) : { error: "Person Not Removed" }))
        .catch((error) => res.status(500).json({ error }));
    }
    return errorResponse({ res, message: "id is missing", data: {} })
  };

}

const personController = new PersonController();
export default personController;

