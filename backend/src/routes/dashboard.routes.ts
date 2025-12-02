import { Router } from 'express';
import {
  getDashboardStats,
  getKPIs,
  getRecentActivity,
  getChartData,
  getUpcoming,
} from '../controllers/dashboard.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// @route   GET /api/dashboard/stats
// @desc    Obtener estadísticas generales
// @access  Private
router.get('/stats', getDashboardStats);

// @route   GET /api/dashboard/kpis
// @desc    Obtener KPIs por rol
// @access  Private
router.get('/kpis', getKPIs);

// @route   GET /api/dashboard/recent-activity
// @desc    Obtener actividad reciente
// @access  Private
router.get('/recent-activity', getRecentActivity);

// @route   GET /api/dashboard/charts
// @desc    Obtener datos para gráficas
// @access  Private
router.get('/charts', getChartData);

// @route   GET /api/dashboard/upcoming
// @desc    Obtener próximas tareas/eventos
// @access  Private
router.get('/upcoming', getUpcoming);

export default router;
