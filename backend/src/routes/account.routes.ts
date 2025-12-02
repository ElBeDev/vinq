import express from 'express';
import {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  bulkDeleteAccounts,
  assignAccount,
  setParentAccount,
  getAccountStats,
} from '../controllers/account.controller';
import { requireAuth, requireRole } from '../middlewares/auth';
import { UserRole } from '../utils/constants';
import { validate, validateParams } from '../middlewares/validate';
import {
  createAccountSchema,
  updateAccountSchema,
  getAccountSchema,
  assignAccountSchema,
  setParentAccountSchema,
  bulkDeleteAccountsSchema,
} from '../schemas/account.schema';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Stats route (before /:id to avoid conflict)
router.get('/stats', getAccountStats);

// Bulk delete (Admin/Manager only)
router.delete(
  '/bulk',
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  validate(bulkDeleteAccountsSchema),
  bulkDeleteAccounts
);

// CRUD routes
router
  .route('/')
  .post(validate(createAccountSchema), createAccount)
  .get(getAccounts);

router
  .route('/:id')
  .get(validateParams(getAccountSchema), getAccount)
  .patch(
    validateParams(getAccountSchema),
    validate(updateAccountSchema),
    updateAccount
  )
  .delete(
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    validateParams(getAccountSchema),
    deleteAccount
  );

// Assignment (Admin/Manager only)
router.patch(
  '/:id/assign',
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  validateParams(getAccountSchema),
  validate(assignAccountSchema),
  assignAccount
);

// Set parent account (hierarchy)
router.patch(
  '/:id/set-parent',
  validateParams(getAccountSchema),
  validate(setParentAccountSchema),
  setParentAccount
);

export default router;
