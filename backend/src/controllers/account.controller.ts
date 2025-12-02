import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';

/**
 * TODO: Migrate to Prisma
 * This controller needs to be fully rewritten to use prisma.account
 */

export const createAccount = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const getAccounts = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const getAccount = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const updateAccount = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const deleteAccount = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const bulkDeleteAccounts = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const assignAccount = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const setParentAccount = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const getAccountStats = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};
