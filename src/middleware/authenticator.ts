import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IEmployee, IUser } from "../models";
import { config } from "../config/config";
import { employeeController, permissionController } from "../controllers";
import { errorResponse } from "../libraries/unified_response";
import { Logger } from "../libraries/logger";

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

    const currentUrl = req.originalUrl.split('?')[0]

    const openUrls = [
      "/businesses/create",
      "/permissions/get",
    ]

    let unProtectedUrl = false

    openUrls.forEach(openUrl => {
      if (openUrl.includes(currentUrl)) {
        unProtectedUrl = openUrl === currentUrl
      }
    })

    if (unProtectedUrl) {
      next();
    } else {

      if (!jobId || !decoded) {
        throw new Error(`jobIdValidation: ${!!jobId}, tokenValidation: ${!!decoded}`)
      }

      const employee = await employeeController.fromId(jobId);

      const permitted = employee?.permissions?.filter(perm => { return perm.name == currentUrl })

      if (!employee || !permitted || permitted.length < 1) {
        throw new Error(`validEmployee: ${!!employee}, accessPermit: ${!!permitted && permitted.length > 0}`)
      }

      req.body.employee = employee
      next(); // Proceed to the next middleware or route handler

    }

  } catch (error) {
    return errorResponse({ res, code: 401, message: "un_autherized Black Vigo comming for you...", data: { error } })
  }
};
