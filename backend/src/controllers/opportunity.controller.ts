import { Request, Response, NextFunction } from 'express';
import Opportunity from '../models/Opportunity.model';
import { AppError } from '../middlewares/errorHandler';

export const createOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const opportunity = await Opportunity.create({
      ...req.body,
      assignedTo: req.body.assignedTo || req.user?.id,
    });

    res.status(201).json({
      status: 'success',
      data: { opportunity },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOpportunities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter: any = {};

    // Si no es admin o manager, solo ver sus oportunidades
    if (req.user?.role === 'agent' || req.user?.role === 'user') {
      filter.assignedTo = req.user.id;
    }

    // Filtros adicionales
    if (req.query.stage) filter.stage = req.query.stage;

    const opportunities = await Opportunity.find(filter)
      .populate('assignedTo', 'firstName lastName email')
      .populate('client', 'firstName lastName email phone')
      .populate('property', 'title price type address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: opportunities.length,
      data: { opportunities },
    });
  } catch (error) {
    next(error);
  }
};

export const getOpportunityById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('client', 'firstName lastName email phone')
      .populate('property')
      .populate('activities.createdBy', 'firstName lastName');

    if (!opportunity) {
      return next(new AppError('Oportunidad no encontrada', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { opportunity },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'firstName lastName email')
      .populate('client', 'firstName lastName email phone')
      .populate('property', 'title price type');

    if (!opportunity) {
      return next(new AppError('Oportunidad no encontrada', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { opportunity },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id);

    if (!opportunity) {
      return next(new AppError('Oportunidad no encontrada', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const addActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(new AppError('Oportunidad no encontrada', 404));
    }

    opportunity.activities.push({
      ...req.body,
      createdBy: req.user?.id,
    });

    await opportunity.save();

    res.status(201).json({
      status: 'success',
      data: { opportunity },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { stage } = req.body;

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(new AppError('Oportunidad no encontrada', 404));
    }

    opportunity.stage = stage;

    // Actualizar probabilidad según etapa
    const probabilityMap: Record<string, number> = {
      prospecting: 10,
      qualification: 25,
      proposal: 50,
      negotiation: 75,
      'closed-won': 100,
      'closed-lost': 0,
    };

    opportunity.probability = probabilityMap[stage] || opportunity.probability;

    // Si se cerró, agregar fecha de cierre
    if (stage === 'closed-won' || stage === 'closed-lost') {
      opportunity.actualCloseDate = new Date();
    }

    await opportunity.save();

    res.status(200).json({
      status: 'success',
      data: { opportunity },
    });
  } catch (error) {
    next(error);
  }
};
