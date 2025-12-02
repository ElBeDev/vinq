import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';

/**
 * TODO: Migrate to Prisma
 * This controller needs to be fully rewritten to use prisma.contact
 */

export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const getContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const getContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const deleteContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const bulkDeleteContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const assignContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const linkToAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const mergeContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const getContactStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};
