// Path: src/middleware/authMiddleware.ts

import { validate, parse, type InitDataParsed } from '@telegram-apps/init-data-node';
import { 
    RequestHandler, 
    ErrorRequestHandler, 
    Response, 
    Request, 
    NextFunction 
} from 'express';
import dotenv from 'dotenv';

dotenv.config();
const getGiftAppToken = process.env.TELEGRAMBOTTOKEN!;


/**
 * Sets init data in the specified Response object.
 * @param res - Response object.
 * @param initData - init data.
 */
function setInitData(res: Response, initData: InitDataParsed): void {
  res.locals.initData = initData;
}

/**
 * Extracts init data from the Response object.
 * @param res - Response object.
 * @returns Init data stored in the Response object. Can return undefined in case,
 * the client is not authorized.
 */
function getInitData(res: Response): InitDataParsed | undefined {
  return res.locals.initData;
}

/**
 * Middleware to authorize external clients.
 * Expects init data in the Authorization header in the format: <auth-type> <auth-data>
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    // We expect passing init data in the Authorization header in the following format:
    // <auth-type> <auth-data>
    // <auth-type> must be "giftAppTma", and <auth-data> is Telegram Mini Apps init data.
    const [authType, authData = ''] = (req.header('authorization') || '').split(' ');

    switch (authType) {
        case 'giftAppTma':
            try {
                validate(authData, getGiftAppToken, {
                    expiresIn: 3600,
                });

                setInitData(res, parse(authData));
                return next();
            } catch (e) {
                return next(e);
            }
        default:
            return next(new Error('Unauthorized'));
    }
};

/**
 * Middleware to display the user's init data.
 * @param _req - The request object (unused).
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export const showInitDataMiddleware: RequestHandler = (_req: Request, res: Response, next: NextFunction) => {
  const initData = getInitData(res);
  if (!initData) {
    return next(new Error('Cant display init data as long as it was not found'));
  }
  res.json(initData);
};

/**
 * Middleware to handle errors and display them in a JSON response.
 * @param err - The error object.
 * @param _req - The request object (unused).
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export const defaultErrorMiddleware: ErrorRequestHandler = (err, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500);
  res.json({error: err.message, stack: err.stack});
};