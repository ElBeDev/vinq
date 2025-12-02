import { Request, Response, NextFunction } from 'express';
import Contact from '../models/Contact';
import { AppError } from '../middlewares/errorHandler';
import {
  CreateContactInput,
  UpdateContactInput,
  GetContactsQuery,
  MergeContactsInput,
  LinkToAccountInput,
} from '../schemas/contact.schema';

/**
 * @desc    Crear un nuevo contacto
 * @route   POST /api/contacts
 * @access  Private
 */
export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: CreateContactInput = req.body;
    
    // Verificar si el email ya existe
    const existingContact = await Contact.findOne({ email: data.email });
    if (existingContact) {
      throw new AppError('Ya existe un contacto con este email', 400);
      return;
    }

    // Crear contacto
    const contact = await Contact.create({
      ...data,
      createdBy: req.user?._id,
    });

    // Poblar referencias
    await contact.populate([
      { path: 'account', select: 'name industry' },
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener todos los contactos con filtros
 * @route   GET /api/contacts
 * @access  Private
 */
export const getContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as GetContactsQuery;
    
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construir filtros
    const filter: any = {};

    if (query.account) {
      filter.account = query.account;
    }

    if (query.assignedTo) {
      filter.assignedTo = query.assignedTo;
    }

    if (query.leadSource) {
      filter.leadSource = query.leadSource;
    }

    if (query.isPrimary) {
      filter.isPrimary = query.isPrimary === 'true';
    }

    // Búsqueda por texto
    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
        { mobile: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Ordenamiento
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const sort: { [key: string]: 1 | -1 } = { [sortBy]: sortOrder };

    // Ejecutar query con paginación
    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .populate('account', 'name industry')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Contact.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener un contacto por ID
 * @route   GET /api/contacts/:id
 * @access  Private
 */
export const getContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('account', 'name industry website phone')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!contact) {
      throw new AppError('Contacto no encontrado', 404);
      return;
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar un contacto
 * @route   PATCH /api/contacts/:id
 * @access  Private
 */
export const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: UpdateContactInput = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      throw new AppError('Contacto no encontrado', 404);
      return;
    }

    // Si se cambia el email, verificar que no exista
    if (data.email && data.email !== contact.email) {
      const existingContact = await Contact.findOne({ email: data.email });
      if (existingContact) {
        throw new AppError('Ya existe un contacto con este email', 400);
        return;
      }
    }

    // Actualizar contacto
    Object.assign(contact, data);
    await contact.save();

    // Poblar referencias
    await contact.populate([
      { path: 'account', select: 'name industry' },
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar un contacto
 * @route   DELETE /api/contacts/:id
 * @access  Private (Admin/Manager)
 */
export const deleteContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      throw new AppError('Contacto no encontrado', 404);
      return;
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contacto eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar múltiples contactos
 * @route   DELETE /api/contacts/bulk
 * @access  Private (Admin/Manager)
 */
export const bulkDeleteContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new AppError('Debe proporcionar un array de IDs', 400);
      return;
    }

    const result = await Contact.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} contactos eliminados`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Asignar contacto a un usuario
 * @route   PATCH /api/contacts/:id/assign
 * @access  Private (Admin/Manager)
 */
export const assignContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { assignedTo } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      throw new AppError('Contacto no encontrado', 404);
      return;
    }

    contact.assignedTo = assignedTo;
    await contact.save();

    await contact.populate([
      { path: 'account', select: 'name industry' },
      { path: 'assignedTo', select: 'name email' },
    ]);

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Vincular contacto a una cuenta
 * @route   PATCH /api/contacts/:id/link-account
 * @access  Private
 */
export const linkToAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: LinkToAccountInput = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      throw new AppError('Contacto no encontrado', 404);
      return;
    }

    // Si se marca como primario, desmarcar otros contactos de la misma cuenta
    if (data.isPrimary) {
      await Contact.updateMany(
        { account: data.accountId, _id: { $ne: contact._id } },
        { isPrimary: false }
      );
    }

    contact.account = data.accountId as any;
    contact.isPrimary = data.isPrimary;
    await contact.save();

    await contact.populate([
      { path: 'account', select: 'name industry website phone' },
      { path: 'assignedTo', select: 'name email' },
    ]);

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fusionar contactos duplicados
 * @route   POST /api/contacts/merge
 * @access  Private (Admin/Manager)
 */
export const mergeContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: MergeContactsInput = req.body;

    const [sourceContact, targetContact] = await Promise.all([
      Contact.findById(data.sourceContactId),
      Contact.findById(data.targetContactId),
    ]);

    if (!sourceContact || !targetContact) {
      throw new AppError('Uno o ambos contactos no existen', 404);
      return;
    }

    // Fusionar campos según preferencias
    const fieldsToKeep = data.fieldsToKeep || {};
    
    for (const [field, preference] of Object.entries(fieldsToKeep)) {
      if (preference === 'source' && sourceContact[field as keyof typeof sourceContact]) {
        (targetContact as any)[field] = sourceContact[field as keyof typeof sourceContact];
      }
    }

    // TODO: Fusionar actividades relacionadas si mergeActivities === true
    // TODO: Fusionar deals relacionados si mergeDeals === true

    await targetContact.save();
    await sourceContact.deleteOne();

    await targetContact.populate([
      { path: 'account', select: 'name industry' },
      { path: 'assignedTo', select: 'name email' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Contactos fusionados correctamente',
      data: targetContact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener estadísticas de contactos
 * @route   GET /api/contacts/stats
 * @access  Private
 */
export const getContactStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [total, withAccount, byLeadSource] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ account: { $exists: true, $ne: null } }),
      Contact.aggregate([
        {
          $group: {
            _id: '$leadSource',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        withAccount,
        withoutAccount: total - withAccount,
        byLeadSource,
      },
    });
  } catch (error) {
    next(error);
  }
};
