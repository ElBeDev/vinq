import { Router } from 'express';
import {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  assignContact,
  linkToAccount,
  mergeContacts,
  getContactStats,
} from '../controllers/contact.controller';
import { requireAuth, requireRole } from '../middlewares/auth';
import { UserRole } from '../utils/constants';
import { validate } from '../middlewares/validate';
import {
  createContactSchema,
  updateContactSchema,
  getContactSchema,
  linkToAccountSchema,
  assignContactSchema,
  mergeContactsSchema,
} from '../schemas/contact.schema';

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// @route   GET /api/contacts/stats
// @desc    Obtener estadísticas de contactos
// @access  Private
router.get('/stats', getContactStats);

// @route   POST /api/contacts/merge
// @desc    Fusionar contactos duplicados
// @access  Private (Admin/Manager)
router.post(
  '/merge',
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  validate(mergeContactsSchema),
  mergeContacts
);

// @route   DELETE /api/contacts/bulk
// @desc    Eliminar múltiples contactos
// @access  Private (Admin/Manager)
router.delete(
  '/bulk',
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  bulkDeleteContacts
);

// @route   POST /api/contacts
// @desc    Crear nuevo contacto
// @access  Private
router.post('/', validate(createContactSchema), createContact);

// @route   GET /api/contacts
// @desc    Obtener todos los contactos con filtros
// @access  Private
router.get('/', getContacts);

// @route   GET /api/contacts/:id
// @desc    Obtener contacto por ID
// @access  Private
router.get('/:id', validate(getContactSchema), getContact);

// @route   PATCH /api/contacts/:id
// @desc    Actualizar contacto
// @access  Private
router.patch('/:id', validate(updateContactSchema), updateContact);

// @route   DELETE /api/contacts/:id
// @desc    Eliminar contacto
// @access  Private (Admin/Manager)
router.delete(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  deleteContact
);

// @route   PATCH /api/contacts/:id/assign
// @desc    Asignar contacto a usuario
// @access  Private (Admin/Manager)
router.patch(
  '/:id/assign',
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  validate(assignContactSchema),
  assignContact
);

// @route   PATCH /api/contacts/:id/link-account
// @desc    Vincular contacto a una cuenta
// @access  Private
router.patch(
  '/:id/link-account',
  validate(linkToAccountSchema),
  linkToAccount
);

export default router;
