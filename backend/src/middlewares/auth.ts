import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import prisma from '../config/db';
import { UserRole, UserStatus } from '../utils/constants';
import { logger } from '../utils/logger';

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        role: 'ADMIN' | 'MANAGER' | 'AGENT';
        status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
        emailVerified: boolean;
      };
    }
  }
}

// Verificar JWT y agregar usuario al request
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No autorizado. Token no proporcionado', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string };

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        password: true,
      },
    });

    if (!user) {
      throw new AppError('Usuario no encontrado', 401);
    }

    // Verificar que el usuario esté activo
    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError('Cuenta inactiva. Contacte al administrador', 403);
    }

    // Agregar usuario al request (sin password)
    const { password: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.error('JWT Error:', error.message);
      next(new AppError('Token inválido', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      logger.error('JWT Expired:', error.message);
      next(new AppError('Token expirado', 401));
    } else {
      next(error);
    }
  }
};

// Middleware para verificar roles específicos
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Usuario no autenticado', 401);
    }

    if (!roles.includes(req.user.role as UserRole)) {
      throw new AppError(
        'No tienes permisos para realizar esta acción',
        403
      );
    }

    next();
  };
};

// Middleware para verificar que el usuario sea ADMIN
export const requireAdmin = requireRole(UserRole.ADMIN);

// Middleware para verificar que el usuario sea ADMIN o MANAGER
export const requireAdminOrManager = requireRole(
  UserRole.ADMIN,
  UserRole.MANAGER
);

// Verificar que el usuario sea el dueño del recurso o admin
export const requireOwnerOrAdmin = (resourceUserIdField = 'userId') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Usuario no autenticado', 401);
    }

    // Si es admin, permitir acceso
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Verificar que el usuario sea el dueño del recurso
    const resourceUserId =
      req.params[resourceUserIdField] || req.body[resourceUserIdField];

    if (req.user.id !== resourceUserId) {
      throw new AppError('No tienes permisos para acceder a este recurso', 403);
    }

    next();
  };
};
