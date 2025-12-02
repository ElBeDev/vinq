import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';

/**
 * TODO: Migrate to Prisma
 * This controller needs to be fully rewritten to use prisma.lead
 */

export const createLead = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Lead endpoints not yet implemented', 501));
};

export const getLeads = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Lead endpoints not yet implemented', 501));
};

export const getLead = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Lead endpoints not yet implemented', 501));
};

export const updateLead = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Lead endpoints not yet implemented', 501));
};

export const deleteLead = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Lead endpoints not yet implemented', 501));
};

export const bulkDeleteLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Lead endpoints not yet implemented', 501));
};

export const assignLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Lead endpoints not yet implemented', 501));
};

export const convertLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Lead endpoints not yet implemented', 501));
};

export const getLeadStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next(new AppError('Lead endpoints not yet implemented', 501));
};
