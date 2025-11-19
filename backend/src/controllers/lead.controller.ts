import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead.model';
import Opportunity from '../models/Opportunity.model';
import { AppError } from '../middlewares/errorHandler';

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      assignedTo: req.body.assignedTo || req.user?.id,
    });

    res.status(201).json({
      status: 'success',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter: any = {};

    // Si no es admin o manager, solo ver sus leads
    if (req.user?.role === 'agent' || req.user?.role === 'user') {
      filter.assignedTo = req.user.id;
    }

    // Filtros adicionales
    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: leads.length,
      data: { leads },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('activities.createdBy', 'firstName lastName');

    if (!lead) {
      return next(new AppError('Lead no encontrado', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'firstName lastName email');

    if (!lead) {
      return next(new AppError('Lead no encontrado', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return next(new AppError('Lead no encontrado', 404));
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
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(new AppError('Lead no encontrado', 404));
    }

    lead.activities.push({
      ...req.body,
      createdBy: req.user?.id,
    });

    await lead.save();

    res.status(201).json({
      status: 'success',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const convertToOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(new AppError('Lead no encontrado', 404));
    }

    if (lead.status === 'converted') {
      return next(new AppError('Este lead ya fue convertido', 400));
    }

    const { propertyId, value, expectedCloseDate } = req.body;

    const opportunity = await Opportunity.create({
      name: `${lead.firstName} ${lead.lastName} - Oportunidad`,
      client: lead._id,
      property: propertyId,
      value,
      expectedCloseDate,
      assignedTo: lead.assignedTo || req.user?.id,
      stage: 'prospecting',
      probability: 10,
    });

    lead.status = 'converted';
    lead.convertedToOpportunity = opportunity._id;
    await lead.save();

    res.status(201).json({
      status: 'success',
      data: { opportunity },
    });
  } catch (error) {
    next(error);
  }
};
