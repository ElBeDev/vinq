import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

// Middleware genérico para validar request body con Zod
export const validate = (schema: ZodSchema) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validar y transformar datos
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formatear errores de Zod
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const appError = new AppError(
          'Errores de validación',
          400
        );
        (appError as any).errors = errors;
        next(appError);
      } else {
        next(error);
      }
    }
  };
};

// Validar query params
export const validateQuery = (schema: ZodSchema) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const appError = new AppError(
          'Errores de validación en query params',
          400
        );
        (appError as any).errors = errors;
        next(appError);
      } else {
        next(error);
      }
    }
  };
};

// Validar params de URL
export const validateParams = (schema: ZodSchema) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const appError = new AppError(
          'Errores de validación en parámetros',
          400
        );
        (appError as any).errors = errors;
        next(appError);
      } else {
        next(error);
      }
    }
  };
};
