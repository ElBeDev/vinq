import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';

/**
 * TODO: Migrate to Prisma
 * This controller needs to be fully rewritten to use prisma.contact
 */

export const createContact = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const getContacts = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const getContact = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const updateContact = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const deleteContact = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const bulkDeleteContacts = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const assignContact = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const linkToAccount = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const mergeContacts = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};

export const getContactStats = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Contact endpoints not yet implemented', 501));
};
