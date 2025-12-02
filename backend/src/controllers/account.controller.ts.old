import { Request, Response, NextFunction } from 'express';
import Account from '../models/Account';
import {
  CreateAccountInput,
  UpdateAccountInput,
  GetAccountsQueryInput,
  AssignAccountInput,
  SetParentAccountInput,
  BulkDeleteAccountsInput,
} from '../schemas/account.schema';
import { AppError } from '../middlewares/errorHandler';

/**
 * @desc    Create new account
 * @route   POST /api/v1/accounts
 * @access  Private
 */
export const createAccount = async (
  req: Request<{}, {}, CreateAccountInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    // Check if account with same name exists for this user
    const existingAccount = await Account.findOne({
      name: req.body.name,
      createdBy: userId,
    });

    if (existingAccount) {
      return next(new AppError('Ya existe una cuenta con este nombre', 400));
    }

    // Create account
    const account = await Account.create({
      ...req.body,
      createdBy: userId,
    });

    // Populate references
    await account.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
      { path: 'parentAccount', select: 'name accountNumber' },
    ]);

    res.status(201).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all accounts with filters
 * @route   GET /api/v1/accounts
 * @access  Private
 */
export const getAccounts = async (
  req: Request<{}, {}, {}, GetAccountsQueryInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page,
      limit,
      type,
      industry,
      assignedTo,
      territory,
      isActive,
      parentAccount,
      search,
      sortBy,
      sortOrder,
    } = req.query;

    // Build filter
    const filter: any = {};

    if (type) filter.type = type;
    if (industry) filter.industry = industry;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (territory) filter.territory = territory;
    if (isActive !== undefined) filter.isActive = isActive;
    if (parentAccount) filter.parentAccount = parentAccount;

    // Text search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { website: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sort
    const sort: { [key: string]: 1 | -1 } = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    // Execute query
    const [accounts, total] = await Promise.all([
      Account.find(filter)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .populate('parentAccount', 'name accountNumber')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Account.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: accounts,
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
 * @desc    Get single account by ID
 * @route   GET /api/v1/accounts/:id
 * @access  Private
 */
export const getAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const account = await Account.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('parentAccount', 'name accountNumber type industry')
      .populate('contacts')
      .populate('childAccounts');

    if (!account) {
      return next(new AppError('Cuenta no encontrada', 404));
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update account
 * @route   PATCH /api/v1/accounts/:id
 * @access  Private
 */
export const updateAccount = async (
  req: Request<{ id: string }, {}, UpdateAccountInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return next(new AppError('Cuenta no encontrada', 404));
    }

    // Update account
    Object.assign(account, req.body);
    await account.save();

    // Populate references
    await account.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
      { path: 'parentAccount', select: 'name accountNumber' },
    ]);

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete account
 * @route   DELETE /api/v1/accounts/:id
 * @access  Private (Admin/Manager)
 */
export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return next(new AppError('Cuenta no encontrada', 404));
    }

    await account.deleteOne();

    res.json({
      success: true,
      message: 'Cuenta eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk delete accounts
 * @route   DELETE /api/v1/accounts/bulk
 * @access  Private (Admin/Manager)
 */
export const bulkDeleteAccounts = async (
  req: Request<{}, {}, BulkDeleteAccountsInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ids } = req.body;

    const result = await Account.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign account to user
 * @route   PATCH /api/v1/accounts/:id/assign
 * @access  Private (Admin/Manager)
 */
export const assignAccount = async (
  req: Request<{ id: string }, {}, AssignAccountInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return next(new AppError('Cuenta no encontrada', 404));
    }

    account.assignedTo = req.body.assignedTo as any;
    await account.save();

    await account.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Set parent account (hierarchy)
 * @route   PATCH /api/v1/accounts/:id/set-parent
 * @access  Private
 */
export const setParentAccount = async (
  req: Request<{ id: string }, {}, SetParentAccountInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return next(new AppError('Cuenta no encontrada', 404));
    }

    const { parentAccountId } = req.body;

    // Validate parent account exists
    const parentAccount = await Account.findById(parentAccountId);
    if (!parentAccount) {
      return next(new AppError('Cuenta padre no encontrada', 404));
    }

    // Prevent circular reference
    if (parentAccountId === req.params.id) {
      return next(new AppError('Una cuenta no puede ser su propia cuenta padre', 400));
    }

    account.parentAccount = parentAccountId as any;
    await account.save();

    await account.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'parentAccount', select: 'name accountNumber' },
    ]);

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get account statistics
 * @route   GET /api/v1/accounts/stats
 * @access  Private
 */
export const getAccountStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [total, byType, byIndustry, bySize, activeCount, inactiveCount] = await Promise.all([
      Account.countDocuments(),
      Account.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Account.aggregate([
        { $group: { _id: '$industry', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Account.aggregate([
        { $group: { _id: '$size', count: { $sum: 1 } } },
      ]),
      Account.countDocuments({ isActive: true }),
      Account.countDocuments({ isActive: false }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        active: activeCount,
        inactive: inactiveCount,
        byType,
        byIndustry,
        bySize,
      },
    });
  } catch (error) {
    next(error);
  }
};
