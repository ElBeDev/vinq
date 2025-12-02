import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { CreateLeadInput, UpdateLeadInput } from '../schemas/lead.schema';

/**
 * @desc    Crear un nuevo lead
 * @route   POST /api/v1/leads
 * @access  Private
 */
export const createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leadData: CreateLeadInput = req.body;
    const user = req.user;

    // Crear lead con el usuario actual como creador
    const lead = await Lead.create({
      ...leadData,
      createdBy: user?._id,
    });

    // Populate assignedTo y createdBy
    await lead.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener todos los leads con filtros y paginación
 * @route   GET /api/v1/leads
 * @access  Private
 */
export const getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      source,
      rating,
      assignedTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minScore,
      maxScore,
      minBudget,
      maxBudget,
    } = req.query;

    // Construir filtros
    const filter: any = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (rating) filter.rating = rating;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Filtro por score
    if (minScore || maxScore) {
      filter.score = {};
      if (minScore) filter.score.$gte = Number(minScore);
      if (maxScore) filter.score.$lte = Number(maxScore);
    }

    // Filtro por presupuesto
    if (minBudget || maxBudget) {
      if (minBudget) filter.budgetMin = { $gte: Number(minBudget) };
      if (maxBudget) filter.budgetMax = { $lte: Number(maxBudget) };
    }

    // Búsqueda por texto
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }

    // Paginación
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Ordenamiento
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Ejecutar query
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener un lead por ID
 * @route   GET /api/v1/leads/:id
 * @access  Private
 */
export const getLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('convertedContactId')
      .populate('convertedAccountId')
      .populate('convertedDealId');

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar un lead
 * @route   PUT /api/v1/leads/:id
 * @access  Private
 */
export const updateLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateLeadInput = req.body;

    const lead = await Lead.findById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead no encontrado',
      });
      return;
    }

    // Actualizar campos
    Object.assign(lead, updateData);
    await lead.save();

    // Populate referencias
    await lead.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar un lead
 * @route   DELETE /api/v1/leads/:id
 * @access  Private
 */
export const deleteLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead no encontrado',
      });
      return;
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar múltiples leads
 * @route   DELETE /api/v1/leads/bulk
 * @access  Private (Admin/Manager)
 */
export const bulkDeleteLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: 'IDs de leads requeridos',
      });
      return;
    }

    const result = await Lead.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} leads eliminados correctamente`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Asignar lead a un usuario
 * @route   PATCH /api/v1/leads/:id/assign
 * @access  Private (Admin/Manager)
 */
export const assignLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      id,
      { assignedTo },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
      message: 'Lead asignado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Convertir lead a Contact/Account/Deal
 * @route   POST /api/v1/leads/:id/convert
 * @access  Private
 */
export const convertLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    // TODO: Variables will be used when implementing Contact, Account y Deal creation
    const { createContact, createAccount, createDeal } = req.body;
    console.log('Conversion options:', { createContact, createAccount, createDeal });

    const lead = await Lead.findById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead no encontrado',
      });
      return;
    }

    if (lead.isConverted) {
      res.status(400).json({
        success: false,
        message: 'El lead ya fue convertido',
      });
      return;
    }

    // TODO: Implementar creación de Contact, Account y Deal
    // Por ahora solo marcamos como convertido
    lead.isConverted = true;
    lead.convertedDate = new Date();
    lead.status = 'CONVERTED' as any;
    await lead.save();

    res.status(200).json({
      success: true,
      data: lead,
      message: 'Lead convertido correctamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener estadísticas de leads
 * @route   GET /api/v1/leads/stats
 * @access  Private
 */
export const getLeadStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [total, byStatus, bySource, byRating, converted] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$rating', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments({ isConverted: true }),
    ]);

    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(2) : '0';

    res.status(200).json({
      success: true,
      data: {
        total,
        converted,
        conversionRate: `${conversionRate}%`,
        byStatus,
        bySource,
        byRating,
      },
    });
  } catch (error) {
    next(error);
  }
};
