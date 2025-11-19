import { Request, Response, NextFunction } from 'express';
import Activity from '../models/Activity.model';
import { AppError } from '../middlewares/errorHandler';

// Obtener todas las actividades (con filtros)
export const getActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, status, priority, relatedType, relatedId, assignedTo, startDate, endDate } = req.query;
    
    const filter: any = {};
    
    // Filtros por rol
    if (req.user?.role === 'agent') {
      filter.assignedTo = req.user.id;
    } else if (req.user?.role === 'manager') {
      // Manager puede ver las de su equipo (implementar lógica de equipo después)
      filter.assignedTo = req.user.id;
    }
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    
    if (relatedType && relatedId) {
      filter['relatedTo.type'] = relatedType;
      filter['relatedTo.id'] = relatedId;
    }
    
    // Filtro por rango de fechas
    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate as string);
      if (endDate) filter.dueDate.$lte = new Date(endDate as string);
    }
    
    const activities = await Activity.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1, createdAt: -1 })
      .limit(100);
    
    res.status(200).json({
      status: 'success',
      results: activities.length,
      data: { activities },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener una actividad por ID
export const getActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    if (!activity) {
      return next(new AppError('Actividad no encontrada', 404));
    }
    
    // Verificar permisos
    if (
      req.user?.role === 'agent' &&
      activity.assignedTo._id.toString() !== req.user.id
    ) {
      return next(new AppError('No tienes permiso para ver esta actividad', 403));
    }
    
    res.status(200).json({
      status: 'success',
      data: { activity },
    });
  } catch (error) {
    next(error);
  }
};

// Crear nueva actividad
export const createActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activityData = {
      ...req.body,
      createdBy: req.user?.id,
      assignedTo: req.body.assignedTo || req.user?.id,
    };
    
    const activity = await Activity.create(activityData);
    
    await activity.populate('assignedTo', 'name email');
    await activity.populate('createdBy', 'name email');
    
    res.status(201).json({
      status: 'success',
      data: { activity },
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar actividad
export const updateActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return next(new AppError('Actividad no encontrada', 404));
    }
    
    // Verificar permisos
    if (
      req.user?.role === 'agent' &&
      activity.assignedTo.toString() !== req.user.id
    ) {
      return next(new AppError('No tienes permiso para editar esta actividad', 403));
    }
    
    // Si se marca como completada, agregar fecha de completado
    if (req.body.status === 'completed' && !activity.completedDate) {
      req.body.completedDate = new Date();
    }
    
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    res.status(200).json({
      status: 'success',
      data: { activity: updatedActivity },
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar actividad
export const deleteActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return next(new AppError('Actividad no encontrada', 404));
    }
    
    // Solo admin o el creador pueden eliminar
    if (
      req.user?.role !== 'admin' &&
      activity.createdBy.toString() !== req.user?.id
    ) {
      return next(new AppError('No tienes permiso para eliminar esta actividad', 403));
    }
    
    await Activity.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener actividades de hoy
export const getTodayActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const filter: any = {
      dueDate: {
        $gte: today,
        $lt: tomorrow,
      },
      status: { $ne: 'completed' },
    };
    
    if (req.user?.role === 'agent') {
      filter.assignedTo = req.user.id;
    }
    
    const activities = await Activity.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1, priority: -1 });
    
    res.status(200).json({
      status: 'success',
      results: activities.length,
      data: { activities },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener actividades pendientes
export const getPendingActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter: any = {
      status: 'pending',
      dueDate: { $lte: new Date() },
    };
    
    if (req.user?.role === 'agent') {
      filter.assignedTo = req.user.id;
    }
    
    const activities = await Activity.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1, priority: -1 })
      .limit(50);
    
    res.status(200).json({
      status: 'success',
      results: activities.length,
      data: { activities },
    });
  } catch (error) {
    next(error);
  }
};

// Marcar actividad como completada
export const completeActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return next(new AppError('Actividad no encontrada', 404));
    }
    
    if (
      req.user?.role === 'agent' &&
      activity.assignedTo.toString() !== req.user.id
    ) {
      return next(new AppError('No tienes permiso para completar esta actividad', 403));
    }
    
    activity.status = 'completed';
    activity.completedDate = new Date();
    await activity.save();
    
    await activity.populate('assignedTo', 'name email');
    await activity.populate('createdBy', 'name email');
    
    res.status(200).json({
      status: 'success',
      data: { activity },
    });
  } catch (error) {
    next(error);
  }
};
