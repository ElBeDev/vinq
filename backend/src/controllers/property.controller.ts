import { Request, Response, NextFunction } from 'express';
import Property from '../models/Property.model';
import { AppError } from '../middlewares/errorHandler';

export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const property = await Property.create({
      ...req.body,
      createdBy: req.user?.id,
    });

    res.status(201).json({
      status: 'success',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter: any = {};

    // Filtros
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.minPrice) filter.price = { $gte: req.query.minPrice };
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: req.query.maxPrice };
    }

    const properties = await Property.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .populate('owner', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: properties.length,
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('owner', 'firstName lastName email phone');

    if (!property) {
      return next(new AppError('Propiedad no encontrada', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email');

    if (!property) {
      return next(new AppError('Propiedad no encontrada', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return next(new AppError('Propiedad no encontrada', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
