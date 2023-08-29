import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IEmployee, IUser } from "../models";
import { config } from "../config/config";
import { employeeController, permissionController } from "../controllers";
import { errorResponse } from "../libraries/unified_response";

export const authenticator = async (req: Request, res: Response, next: NextFunction) => {
  // Get the JWT token from the request headers
  const token = req.header("x-auth-token");
  const jobId = req.header("job");

  // Check if the token is missing
  if (!token) {
    return errorResponse({ res, code: 401, message: "No token, authorization denied", data: {} })
  }

  try {
    const decoded = jwt.verify(token, config.JWT.key) as IUser; // Verify the token Replace 'your-secret-key' with your actual secret key
    // req.body.user = decoded; // Attach the decoded user to the request object

    if (!jobId || !decoded) {
      return errorResponse({ res, code: 401, message: "un_autherized Black Vigo comming for you...", data: {} })
    }

    const employee = await employeeController.fromId(jobId);

    if (!employee) {
      return errorResponse({ res, code: 401, message: "un_autherized Black Vigo comming for you...", data: {} })
    }

    req.body.employee = employee
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return errorResponse({ res, code: 401, message: "un_autherized Black Vigo comming for you...", data: {} })
  }
};
