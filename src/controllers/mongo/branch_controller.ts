import { NextFunction, Request, Response } from "express";
import { Branch, IBranch, IPermission } from "../../models/mongo";
import { errorResponse, successResponse } from "../../libraries/unified_response";
import { employeeController } from ".";
import { Logger } from "../../libraries/logger";

class BranchController {
  create = async (
    userId: string,
    branch: IBranch,
    permissions?: IPermission[]
  ) => {
    const b = new Branch({ ...branch });
    Logger.i("branch permissions count", permissions?.length);
    return b.save().then((branch) =>
      employeeController
        .create({
          branch: branch._id,
          role: "founder",
          user: userId as any,
          permissions: permissions ?? [],
          status: "active",
        })
        .then((employee) =>
          employee.populate([
            {
              path: "branch",
              populate: { path: "business", model: "Business" },
            },
          ])
        )
    );
  };

  fromId = async (id: string) =>
    Branch.findById(id)
      .populate("business")
      .then((b) => b);
  fromBusinessId = async (id: string) =>
    Branch.find({ business: id })
      .populate("business")
      .then((b) => b);
  fromEmail = async (email: string) =>
    Branch.findOne({ email: email })
      .populate("business")
      .then((b) => b);
  fromContact = async (contact: string) =>
    Branch.findOne({ contact: contact })
      .populate("business")
      .then((b) => b);
  remove = async (id: string) =>
    Branch.findByIdAndDelete(id).then((b) => b);

  createReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IBranch = req.body;
    const userId: string = req.body.employee.user._id;
    const permissions: IPermission[] = req.body.permissions;
    return this.create(userId, body, permissions)
      .then((branch) => successResponse({ res, data: branch }))
      .catch((error) => errorResponse({ res, data: error }));
  };

  // const readFromBusinessId = async (req: Request, res: Response, next: NextFunction) => fromBusinessId(req.query.business_id)
  readReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    const business_id = req.query.business_id;
    const email = req.query.email;
    const contact = req.query.contact;
    if (typeof id == "string") {
      return this.fromId(id)
        .then((branch) =>
          branch
            ? successResponse({ res, data: branch })
            : errorResponse({
              res,
              code: 404,
              message: "Branch Not Found",
              data: {},
            })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    if (typeof business_id == "string") {
      return this.fromBusinessId(business_id)
        .then((branch) =>
          branch
            ? res.status(200).json([...branch])
            : errorResponse({
              res,
              code: 404,
              message: "Branch Not Found",
              data: {},
            })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    if (typeof email == "string") {
      return this.fromEmail(email)
        .then((branch) =>
          branch
            ? successResponse({ res, data: branch })
            : errorResponse({
              res,
              code: 404,
              message: "Branch Not Found",
              data: {},
            })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    if (typeof contact == "string") {
      return this.fromContact(contact)
        .then((branch) =>
          branch
            ? successResponse({ res, data: branch })
            : errorResponse({
              res,
              code: 404,
              message: "Branch Not Found",
              data: {},
            })
        )
        .catch((error) => errorResponse({ res, data: error }));
    }
    return res.status(500).json({
      error:
        "Please make sure to provide id, contact, business_id or email query parameter",
    });
  };
  updateReq = async (req: Request, res: Response, next: NextFunction) => {
    const body: IBranch = req.body;
    return Branch.findByIdAndUpdate(req.body._id, body)
      .then((branch) => successResponse({ res, data: branch }))
      .catch((error) => errorResponse({ res, data: error }));
  };
  removeReq = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    return this.remove(id)
      .then((branch) =>
        branch
          ? successResponse({ res, data: branch })
          : errorResponse({ res, message: "Branch No Removed", data: {} })
      )
      .catch((error) => errorResponse({ res, data: error }));
  };
}

const branchController = new BranchController();
export default branchController;
