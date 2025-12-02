import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RefreshTokenInput,
} from '../schemas/auth.schema';

// Generar JWT Access Token
const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '15m' } as jwt.SignOptions
  );
};

// Generar JWT Refresh Token
const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' } as jwt.SignOptions
  );
};

/**
 * @desc    Registrar nuevo usuario
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (
  req: Request<object, object, RegisterInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('El email ya está registrado', 400);
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
    });

    // Generar tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    logger.info(`Nuevo usuario registrado: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          status: user.status,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login de usuario
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Buscar usuario con password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Verificar status
    if (user.status !== 'ACTIVE') {
      throw new AppError('Cuenta inactiva. Contacte al administrador', 403);
    }

    // Generar tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    logger.info(`Usuario inició sesión: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          status: user.status,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener usuario actual
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Usuario no autenticado', 401);
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          avatar: req.user.avatar,
          phone: req.user.phone,
          status: req.user.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
export const refreshToken = async (
  req: Request<object, object, RefreshTokenInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    // Verificar refresh token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
    ) as { userId: string };

    // Buscar usuario
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    // Verificar status
    if (user.status !== 'ACTIVE') {
      throw new AppError('Cuenta inactiva', 403);
    }

    // Generar nuevo access token
    const newAccessToken = generateAccessToken(user._id.toString());

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Refresh token inválido', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Refresh token expirado', 401));
    } else {
      next(error);
    }
  }
};

/**
 * @desc    Solicitar reset de contraseña
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (
  req: Request<object, object, ForgotPasswordInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // No revelar si el usuario existe o no (por seguridad)
      res.status(200).json({
        success: true,
        message:
          'Si el email existe, recibirás instrucciones para resetear tu contraseña',
      });
      return;
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Guardar token en BD (expira en 1 hora)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save();

    // TODO: Enviar email con el token (integrar servicio de email)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    logger.info(`Reset password solicitado para: ${email}`);
    logger.info(`Reset URL (DEV only): ${resetUrl}`);

    // Por ahora devolver el token en desarrollo (en producción solo enviar email)
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(200).json({
      success: true,
      message:
        'Si el email existe, recibirás instrucciones para resetear tu contraseña',
      ...(isDevelopment && { resetToken, resetUrl }), // Solo en desarrollo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resetear contraseña
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (
  req: Request<object, object, ResetPasswordInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, password } = req.body;

    // Hash del token recibido
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuario con token válido y no expirado
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Token inválido o expirado', 400);
    }

    // Actualizar password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    logger.info(`Contraseña reseteada para usuario: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout (invalidar tokens)
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // En un sistema con blacklist de tokens, aquí se agregaría el token a la lista negra
    // Por ahora, el logout se maneja completamente en el cliente (eliminar tokens)

    logger.info(`Usuario cerró sesión: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Logout exitoso',
    });
  } catch (error) {
    next(error);
  }
};
