import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  bulkDeleteLeads,
  assignLead,
  convertLead,
  getLeadStats,
} from '../controllers/lead.controller';
import { requireAuth, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  createLeadSchema,
  updateLeadSchema,
  getLeadSchema,
  getLeadsQuerySchema,
  assignLeadSchema,
  convertLeadSchema,
} from '../schemas/lead.schema';
import { UserRole } from '../utils/constants';

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// @route   GET /api/v1/leads/stats
// @desc    Obtener estadísticas de leads
// @access  Private
router.get('/stats', getLeadStats);

// @route   GET /api/v1/leads
// @desc    Obtener todos los leads con filtros
// @access  Private
router.get('/', validate(getLeadsQuerySchema), getLeads);

// @route   POST /api/v1/leads
// @desc    Crear un nuevo lead
// @access  Private
router.post('/', validate(createLeadSchema), createLead);

// @route   DELETE /api/v1/leads/bulk
// @desc    Eliminar múltiples leads
// @access  Private (Admin/Manager)
router.delete(
  '/bulk',
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  bulkDeleteLeads
);

// @route   GET /api/v1/leads/:id
// @desc    Obtener un lead por ID
// @access  Private
router.get('/:id', validate(getLeadSchema), getLead);

// @route   PUT /api/v1/leads/:id
// @desc    Actualizar un lead
// @access  Private
router.put('/:id', validate(updateLeadSchema), updateLead);

// @route   DELETE /api/v1/leads/:id
// @desc    Eliminar un lead
// @access  Private
router.delete('/:id', validate(getLeadSchema), deleteLead);

// @route   PATCH /api/v1/leads/:id/assign
// @route   PATCH /api/v1/leads/:id/assign
// @desc    Asignar lead a un usuario
// @access  Private (Admin/Manager)
router.patch(
  '/:id/assign',
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  validate(assignLeadSchema),
  assignLead
);

// @route   POST /api/v1/leads/:id/convert
// @desc    Convertir lead a Contact/Account/Deal
// @access  Private
router.post('/:id/convert', validate(convertLeadSchema), convertLead);

export default router;
