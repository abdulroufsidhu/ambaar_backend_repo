import { Response } from "express";

interface UnifiedResponseProps<T extends any> {
  res: Response;
  code?: number;
  message?: string;
  data?: T;
}
export const successResponse = <T extends any>({
  res, code = 200, message = "", data
}: UnifiedResponseProps<T>) => res.status(code).json({ status: code, message, data })

export const errorResponse = <T extends object>({
  res, code = 500, message = "Error", data = <T>{}
}: UnifiedResponseProps<T>) => res.status(code).json({ status: code, message, data })