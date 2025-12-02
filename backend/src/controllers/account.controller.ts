import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';

/**
 * TODO: Migrate to Prisma
 * This controller needs to be fully rewritten to use prisma.account
 */

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const getAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const getAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const updateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const bulkDeleteAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const assignAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const setParentAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};

export const getAccountStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Account endpoints not yet implemented', 501));
};
