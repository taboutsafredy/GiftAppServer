// Path: src/utils/asyncHandler.ts

import { Request, Response, NextFunction } from "express";

/**
 * Ensures asynchronous error handling in our Express routes.
 * Ensures compatibility with typescript's strict typing.
 * @param fn Route function to be handled.
 * @returns 
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
