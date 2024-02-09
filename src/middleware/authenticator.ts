import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IEmployee, IUser } from "../models/mongo";
import { config } from "../config/config";
import { employeeController } from "../controllers/mongo";
import { errorResponse } from "../libraries/unified_response";
import { Logger } from "../libraries/logger";

export const Authenticator = {
  requireUser: (req: Request, res: Response, next: NextFunction) => {
    // Get the JWT token from the request headers
    const token = req.header("x-auth-token");

    // Check if the token is missing
    if (!token) {
      return errorResponse({
        res,
        code: 401,
        message: "No token, authorization denied",
        data: {},
      });
    }

    try {
      const decoded = jwt.verify(token, config.JWT.key) as IUser; // Verify the token Replace 'your-secret-key' with your actual secret key

      if (!decoded) {
        throw new Error(`Invalid user`);
      }
      req.body.self = decoded; // Attach the decoded user to the request object
      next();
    } catch (error) {
      Logger.d("authenticator", error);
      return errorResponse({
        res,
        code: 401,
        message: "un_autherized Black Vigo comming for you...",
        data: { error },
      });
    }
  },
  requireSelf: (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.self) {
        throw new Error(`User not found`);
      }

      // Check if the user is accessing their own data
      const resourceId = !!req.params.uid ? req.params.uid : req.query.uid ; // Assuming you're working with a resource ID in the URL

      if (req.body.self._id == resourceId) {
        next(); // User is accessing their own data, continue to the next middleware
      } else {
        throw new Error(`Access to other user's data is not allowed`);
      }
    } catch (error) {
      Logger.d("authenticator", error);
      errorResponse({ res, data: error });
    }
  },
  requireEmployeement: (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.self) {
        throw new Error(`user not found`);
      }
      const jobId = req.header("job");
      if (!jobId) {
        throw new Error(
          `jobIdValidation: ${!!jobId}, tokenValidation: ${!!req.body.user}`
        );
      }

      employeeController
        .fromId(jobId)
        .then((e) => {
          req.body.employee = e;
          next();
        })
        .catch((e) => errorResponse({ res, data: e }));
    } catch (error) {
      Logger.d("authenticator", error);
      errorResponse({ res, data: error });
    }
  },
  requirePermission: (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.employee) {
        throw new Error(`employee not found`);
      }
      if(req.body.self._id == req.body.employee.user._id) {
        next()
        return
      }
      const currentUrl = req.originalUrl.split("?")[0].replace(/\/$/, '');
      Logger.i("authenticator currentUrl: ", currentUrl);
      const permitted = (req.body.employee as IEmployee)?.permissions?.filter(
        (perm) => {
          return perm.name == currentUrl;
        }
      );
      if (!permitted || permitted.length < 1) {
        throw new Error(
          `validEmployee: ${!!req.body.employee}, accessPermitted: ${
            !!permitted && permitted.length > 0
          }`
        );
      }
      next();
    } catch (error) {
      Logger.d("authenticator", error);
      errorResponse({ res, data: error });
    }
  },
};
