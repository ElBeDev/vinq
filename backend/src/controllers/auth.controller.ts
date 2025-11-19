import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { AppError } from '../middlewares/errorHandler';

const signToken = (id: string, email: string, role: string) => {
  return jwt.sign(
    { id, email, role }, 
    process.env.JWT_SECRET as string, 
    { expiresIn: process.env.JWT_EXPIRE || '7d' } as any
  );
};

const signRefreshToken = (id: string) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_REFRESH_SECRET as string, 
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' } as any
  );
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('El email ya está registrado', 400));
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'user',
      phone,
    });

    const token = signToken(user._id.toString(), user.email, user.role);
    const refreshToken = signRefreshToken(user._id.toString());

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Por favor proporciona email y contraseña', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Email o contraseña incorrectos', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Tu cuenta ha sido desactivada', 401));
    }

    const token = signToken(user._id.toString(), user.email, user.role);
    const refreshToken = signRefreshToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return next(new AppError('Usuario no encontrado', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token requerido', 400));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return next(new AppError('Usuario no válido', 401));
    }

    const newToken = signToken(user._id.toString(), user.email, user.role);
    const newRefreshToken = signRefreshToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return next(new AppError('Refresh token inválido o expirado', 401));
  }
};
