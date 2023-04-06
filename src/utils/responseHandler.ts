import { Response } from "express";
import { ApiError } from "./errorHandler";

export function sendJsonResponse(res: Response, success: boolean, data: any, statusCode?: number, errorMessage?: string) {
  if (success) {
    return res.status(statusCode || 200).json({ success, data });
  } else {
    throw new ApiError(404, errorMessage)
  }
}