import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models";
import { config } from "../config/config";

const authenticator = (req: Request, res: Response, next: NextFunction) => {
  // Get the JWT token from the request headers
  const token = req.header("x-auth-token");

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT.key) as IUser; // Verify the token Replace 'your-secret-key' with your actual secret key
    req.body.user = decoded; // Attach the decoded user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
